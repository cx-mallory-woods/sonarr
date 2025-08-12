using System.Collections.Generic;
using System.Linq;
using FizzWare.NBuilder;
using FluentAssertions;
using NUnit.Framework;
using NzbDrone.Core.Profiles.Releases;
using NzbDrone.Core.Test.Framework;

namespace NzbDrone.Core.Test.Profiles
{
    [TestFixture]
    public class ReleaseProfileServiceFixture : CoreTest<ReleaseProfileService>
    {
        private List<ReleaseProfile> _releaseProfiles;
        private ReleaseProfile _defaultReleaseProfile;
        private ReleaseProfile _includedReleaseProfile;
        private ReleaseProfile _excludedReleaseProfile;
        [SetUp]
        public void Setup()
        {
            _releaseProfiles = Builder<ReleaseProfile>.CreateListOfSize(3).TheFirst(1)
                .With(r => r.Required = ["required_one"])
                .TheNext(1)
                .With(r => r.Required = ["required_two"])
                .TheNext(1)
                .With(r => r.Required = ["required_three"])
                .Build()
                .ToList();

            _defaultReleaseProfile = _releaseProfiles[0];
            _includedReleaseProfile = _releaseProfiles[1];
            _includedReleaseProfile.Tags.Add(1);
            _excludedReleaseProfile = _releaseProfiles[2];
            _excludedReleaseProfile.ExcludedTags.Add(2);

            Mocker.GetMock<IRestrictionRepository>()
                  .Setup(s => s.All())
                  .Returns(_releaseProfiles);
        }

        [Test]
        public void untagged_artist_should_match_default_and_excluded_release_profiles()
        {
            var releaseProfiles = Subject.AllForTags([]);
            releaseProfiles.Should().Equal([_defaultReleaseProfile, _excludedReleaseProfile]);
        }

        [Test]
        public void all_for_tags_should_match_default_and_included_and_not_excluded_release_profiles()
        {
            var releaseProfiles = Subject.AllForTags([1]);
            releaseProfiles.Should().Equal([_defaultReleaseProfile, _includedReleaseProfile, _excludedReleaseProfile]);
        }

        [Test]
        public void all_for_tags_should_not_match_excluded_release_profiles()
        {
            var releaseProfiles = Subject.AllForTags([2]);
            releaseProfiles.Should().Equal([_defaultReleaseProfile]);
        }

        [Test]
        public void all_for_tag_should_match_included_release_profiles()
        {
            var releaseProfiles = Subject.AllForTag(1);
            releaseProfiles.Should().Equal([_includedReleaseProfile]);
        }

        [Test]
        public void all_should_match_all_release_profiles()
        {
            var releaseProfiles = Subject.All();
            releaseProfiles.Should().Equal(_releaseProfiles);
        }
    }
}
