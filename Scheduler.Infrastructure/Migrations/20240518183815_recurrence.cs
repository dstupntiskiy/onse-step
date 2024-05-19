using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class recurrence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Recurrence",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    startdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    enddate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    daysofweekjson = table.Column<string>(type: "text", nullable: true),
                    exceptdatesjson = table.Column<string>(type: "text", nullable: true),
                    createdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recurrence", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Event_Recurrence_RecurrenceId",
                table: "Event");

            migrationBuilder.DropTable(
                name: "Recurrence");

            migrationBuilder.DropIndex(
                name: "IX_Event_RecurrenceId",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "RecurrenceId",
                table: "Event");
        }
    }
}
