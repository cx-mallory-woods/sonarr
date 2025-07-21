using FluentMigrator;
using NzbDrone.Core.Datastore.Migration.Framework;

namespace NzbDrone.Core.Datastore.Migration
{
    [Migration(221)]
    public class add_season_pack_upgrade : NzbDroneMigrationBase
    {
        protected override void MainDbUpgrade()
        {
            var sql = "INSERT INTO \"Config\" (\"Key\", \"Value\") VALUES ('allowseasonpackupgrade', 'all');";
            Execute.Sql(sql);

            sql = "INSERT INTO \"Config\" (\"Key\", \"Value\") VALUES ('seasonpackupgradethreshold', '100');";
            Execute.Sql(sql);
        }
    }
}

