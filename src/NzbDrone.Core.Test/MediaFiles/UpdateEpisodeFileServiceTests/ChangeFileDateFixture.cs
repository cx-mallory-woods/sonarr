using System;
using System.Reflection;
using FluentAssertions;
using Moq;
using NUnit.Framework;
using NzbDrone.Common.Disk;
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
            _lastWrite = new DateTime(2025, 07, 27, 12, 0, 0, 512, 512, DateTimeKind.Utc);

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
            var previousWrite = new DateTime(_lastWrite.Ticks, _lastWrite.Kind);

            var localDate = _lastWrite.ToLocalTime().AddDays(2);

            var firstResult = InvokePrivate(FilePath, localDate);
            firstResult.Should().BeTrue("First pass should update mtime");

            _lastWrite.ToLocalTime().Should().Be(localDate.WithTicksFrom(previousWrite));

            var secondResult = InvokePrivate(FilePath, localDate);
            secondResult.Should().BeFalse("Second pass shouldn't update mtime: set and get are out of parity");
        }

        [Test]
        public void should_clamp_mtime_on_posix()
        {
            PosixOnly();

            var previousWrite = new DateTime(_lastWrite.Ticks, _lastWrite.Kind);
            var oldLocalDate = new DateTime(1965, 1, 1, 0, 0, 0, 512, DateTimeKind.Local);

            var firstResult = InvokePrivate(FilePath, oldLocalDate);
            firstResult.Should().BeTrue("First pass should update mtime");

            _lastWrite.ToLocalTime().Should().Be(
                    DateTimeExtensions.EpochTime.ToLocalTime().WithTicksFrom(previousWrite));

            var secondResult = InvokePrivate(FilePath, oldLocalDate);
            secondResult.Should().BeFalse("Second pass shouldn't update mtime: set and get are out of parity");
        }

        [Test]
        public void should_not_clamp_mtime_on_windows()
        {
            WindowsOnly();

            var previousWrite = new DateTime(_lastWrite.Ticks, _lastWrite.Kind);
            var oldLocalDate = new DateTime(1965, 1, 1, 0, 0, 0, 512, DateTimeKind.Local);

            var firstResult = InvokePrivate(FilePath, oldLocalDate);
            firstResult.Should().BeTrue("First pass should update mtime");

            _lastWrite.ToLocalTime().Should().Be(oldLocalDate.WithTicksFrom(previousWrite));

            var secondResult = InvokePrivate(FilePath, oldLocalDate);
            secondResult.Should().BeFalse("Second pass shouldn't update mtime: set and get are out of parity");
        }
    }
}
