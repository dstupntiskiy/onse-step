using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class coach : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CoachId",
                table: "Event",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Coach",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Style = table.Column<string>(type: "text", nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coach", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Event_CoachId",
                table: "Event",
                column: "CoachId");

            migrationBuilder.AddForeignKey(
                name: "FK_Event_Coach_CoachId",
                table: "Event",
                column: "CoachId",
                principalTable: "Coach",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Event_Coach_CoachId",
                table: "Event");

            migrationBuilder.DropTable(
                name: "Coach");

            migrationBuilder.DropIndex(
                name: "IX_Event_CoachId",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "CoachId",
                table: "Event");
        }
    }
}
