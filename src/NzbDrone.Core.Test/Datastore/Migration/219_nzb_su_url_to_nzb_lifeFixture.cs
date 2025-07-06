using System.Linq;
using FluentAssertions;
using NUnit.Framework;
using NzbDrone.Common.Serializer;
using NzbDrone.Core.Datastore.Migration;
using NzbDrone.Core.Test.Framework;

namespace NzbDrone.Core.Test.Datastore.Migration
{
    [TestFixture]
    public class nzb_su_url_to_nzb_lifeFixture : MigrationTest<nzb_su_url_to_nzb_life>
    {
        [TestCase("Newznab", "https://api.nzb.su")]
        [TestCase("Newznab", "http://api.nzb.su")]
        public void should_replace_old_url(string impl, string baseUrl)
        {
            var db = WithMigrationTestDb(c =>
            {
                c.Insert.IntoTable("Indexers").Row(new
                {
                    Name = "Nzb.su",
                    Implementation = impl,
                    Settings = new NewznabSettings219
                    {
                        BaseUrl = baseUrl,
                        ApiPath = "/api"
                    }.ToJson(),
                    ConfigContract = impl + "Settings",
                    EnableInteractiveSearch = false
                });
            });

            var items = db.Query<IndexerDefinition219>("SELECT * FROM \"Indexers\"");

            items.Should().HaveCount(1);
            items.First().Settings.ToObject<NewznabSettings219>().BaseUrl.Should().Be(baseUrl.Replace("su", "life"));
        }
    }
}
