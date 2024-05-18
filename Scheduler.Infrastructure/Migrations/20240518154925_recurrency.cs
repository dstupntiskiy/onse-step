using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class recurrency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ReccurrencyId",
                table: "Event",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Recurrency",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    startdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    enddate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    daysofweek = table.Column<int[]>(type: "integer[]", nullable: false),
                    exceptdates = table.Column<DateTime[]>(type: "timestamp with time zone[]", nullable: true),
                    createdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recurrency", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Event_ReccurrencyId",
                table: "Event",
                column: "ReccurrencyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Event_Recurrency_ReccurrencyId",
                table: "Event",
                column: "ReccurrencyId",
                principalTable: "Recurrency",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Event_Recurrency_ReccurrencyId",
                table: "Event");

            migrationBuilder.DropTable(
                name: "Recurrency");

            migrationBuilder.DropIndex(
                name: "IX_Event_ReccurrencyId",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "ReccurrencyId",
                table: "Event");
        }
    }
}
