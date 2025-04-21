using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class userIdremovecreatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "User");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Style");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Recurrence");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "OneTimeVisitPayment");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "OneTimeVisit");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Membership");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "GroupPayment");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "GroupMemberLink");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Group");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EventParticipance");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EventCoachSubstitution");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Coach");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Client");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "User",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Style",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Recurrence",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "OneTimeVisitPayment",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "OneTimeVisit",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Membership",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "GroupPayment",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "GroupMemberLink",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Group",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EventParticipance",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EventCoachSubstitution",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Event",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Coach",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Client",
                type: "timestamp with time zone",
                nullable: true);
        }
    }
}
