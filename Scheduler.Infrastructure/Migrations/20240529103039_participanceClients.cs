using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class participanceClients : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventParticipance_ClientProjection_ClientId",
                table: "EventParticipance");

            migrationBuilder.DropTable(
                name: "ClientProjection");

            migrationBuilder.AddForeignKey(
                name: "FK_EventParticipance_Client_ClientId",
                table: "EventParticipance",
                column: "ClientId",
                principalTable: "Client",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventParticipance_Client_ClientId",
                table: "EventParticipance");

            migrationBuilder.CreateTable(
                name: "ClientProjection",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientProjection", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_EventParticipance_ClientProjection_ClientId",
                table: "EventParticipance",
                column: "ClientId",
                principalTable: "ClientProjection",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
