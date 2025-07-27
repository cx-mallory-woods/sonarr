using System;
using System.Reflection;
using Moq;
using NUnit.Framework;
using NzbDrone.Common.Disk;
using NzbDrone.Common.EnvironmentInfo;
using NzbDrone.Common.Extensions;
using NzbDrone.Core.MediaFiles;
using NzbDrone.Core.Test.Framework;

namespace NzbDrone.Core.Test.MediaFiles.UpdateEpisodeFileServiceTests
{
    [TestFixture]
    public class ChangeFileDateFixture : CoreTest<UpdateEpisodeFileService>
    {
        private const string FilePath = "dummy.file";
        private DateTime _lastWrite;

        private bool InvokePrivate(string path, DateTime airDate)
        {
            var method = typeof(UpdateEpisodeFileService)
                .GetMethod("ChangeFileDateToLocalDate", BindingFlags.NonPublic | BindingFlags.Instance);
            return (bool)method.Invoke(Subject, [path, airDate]);
        }

        [SetUp]
        public void Setup()
        {
            _lastWrite = new DateTime(2025, 07, 27, 12, 0, 0, 512, DateTimeKind.Utc);

            Mocker.GetMock<IDiskProvider>()
                .Setup(x => x.FileGetLastWrite(FilePath))
                .Returns(() => _lastWrite);

            Mocker.GetMock<IDiskProvider>()
                .Setup(x => x.FileSetLastWriteTime(FilePath, It.IsAny<DateTime>()))
                .Callback<string, DateTime>((path, dateTime) =>
                {
                    _lastWrite = dateTime.Kind == DateTimeKind.Utc
                        ? dateTime
                        : dateTime.ToUniversalTime();
                });
        }

        [Test]
        public void should_change_date_once_only()
        {
            var oldMillis = _lastWrite.Millisecond;

            // Retain millis when creating localDate; a possible
            // error case is to increment 1 second by adding prior
            // mtime millis to a local date with non-zero millis.
            var localDate = _lastWrite.ToLocalTime().AddDays(2);

            var firstResult = InvokePrivate(FilePath, localDate);
            Assert.IsTrue(firstResult, "First pass should update mtime");

            Assert.AreEqual(
                localDate.WithoutTicks().AddMilliseconds(oldMillis),
                _lastWrite.ToLocalTime(),
                "mtime should equal the supplied local datetime with last write millis");

            var secondResult = InvokePrivate(FilePath, localDate);
            Assert.IsFalse(secondResult, "Second pass shouldn't update mtime: set and get are out of parity");
        }

        [Test]
        public void should_clamp_mtime_on_unix_and_not_on_windows()
        {
            var oldMillis = _lastWrite.Millisecond;
            var oldLocal = new DateTime(1965, 1, 1, 0, 0, 0, 512, DateTimeKind.Local);

            var firstResult = InvokePrivate(FilePath, oldLocal);
            Assert.IsTrue(firstResult, "First pass should update mtime");

            if (OsInfo.IsNotWindows)
            {
                Assert.AreEqual(
                    UpdateEpisodeFileService.EpochTime.ToLocalTime().AddMilliseconds(oldMillis),
                    _lastWrite.ToLocalTime(),
                    "Unix case: mtime should clamp on epoch time (UTC) with last write millis");
            }
            else
            {
                Assert.AreEqual(
                    oldLocal.WithoutTicks().AddMilliseconds(oldMillis),
                    _lastWrite.ToLocalTime(),
                    "Windows case: mtime shouldn't clamp on epoch time and needs last write millis");
            }

            var secondResult = InvokePrivate(FilePath, oldLocal);
            Assert.IsFalse(secondResult, "Second pass shouldn't update mtime: set and get are out of parity");
        }
    }
}
