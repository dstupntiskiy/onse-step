using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class onetimevisit1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ClientId",
                table: "OneTimeVisit",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "EventId",
                table: "OneTimeVisit",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_OneTimeVisit_ClientId",
                table: "OneTimeVisit",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_OneTimeVisit_EventId",
                table: "OneTimeVisit",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_OneTimeVisit_Client_ClientId",
                table: "OneTimeVisit",
                column: "ClientId",
                principalTable: "Client",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OneTimeVisit_Event_EventId",
                table: "OneTimeVisit",
                column: "EventId",
                principalTable: "Event",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OneTimeVisit_Client_ClientId",
                table: "OneTimeVisit");

            migrationBuilder.DropForeignKey(
                name: "FK_OneTimeVisit_Event_EventId",
                table: "OneTimeVisit");

            migrationBuilder.DropIndex(
                name: "IX_OneTimeVisit_ClientId",
                table: "OneTimeVisit");

            migrationBuilder.DropIndex(
                name: "IX_OneTimeVisit_EventId",
                table: "OneTimeVisit");

            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "OneTimeVisit");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "OneTimeVisit");
        }
    }
}
