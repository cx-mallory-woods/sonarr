using System.Collections.Generic;
using FluentMigrator;
using Newtonsoft.Json.Linq;
using NzbDrone.Core.Datastore.Migration.Framework;

namespace NzbDrone.Core.Datastore.Migration
{
    [Migration(219)]
    public class nzb_su_url_to_nzb_life : NzbDroneMigrationBase
    {
        protected override void MainDbUpgrade()
        {
            Execute.Sql("UPDATE \"Indexers\" SET \"Settings\" = replace(\"Settings\", '//api.nzb.su', '//api.nzb.life')" +
                        "WHERE \"Implementation\" = 'Newznab'" +
                        "AND \"Settings\" LIKE '%//api.nzb.su%'");
        }
    }

    public class IndexerDefinition219
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public JObject Settings { get; set; }
        public int Priority { get; set; }
        public string Implementation { get; set; }
        public string ConfigContract { get; set; }
        public bool EnableRss { get; set; }
        public bool EnableAutomaticSearch { get; set; }
        public bool EnableInteractiveSearch { get; set; }
        public HashSet<int> Tags { get; set; }
        public int DownloadClientId { get; set; }
        public int SeasonSearchMaximumSingleEpisodeAge { get; set; }
    }

    public class NewznabSettings219
    {
        public string BaseUrl { get; set; }
        public string ApiPath { get; set; }
    }
}
