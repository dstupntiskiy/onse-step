using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class userId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "User",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "User",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "User",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "User",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Style",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Style",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "Style",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "Style",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Recurrence",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Recurrence",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "Recurrence",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "Recurrence",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "OneTimeVisitPayment",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "OneTimeVisitPayment",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "OneTimeVisitPayment",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "OneTimeVisitPayment",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "OneTimeVisit",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "OneTimeVisit",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "OneTimeVisit",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "OneTimeVisit",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Membership",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Membership",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "Membership",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "Membership",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "GroupPayment",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "GroupPayment",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "GroupPayment",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "GroupPayment",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "GroupMemberLink",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "GroupMemberLink",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "GroupMemberLink",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "GroupMemberLink",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Group",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Group",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "Group",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "Group",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EventParticipance",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "EventParticipance",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "EventParticipance",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "EventParticipance",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EventCoachSubstitution",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "EventCoachSubstitution",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "EventCoachSubstitution",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "EventCoachSubstitution",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Event",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Event",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "Event",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "Event",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Coach",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Coach",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "Coach",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "Coach",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Client",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Client",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "Client",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "Client",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "User");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "User");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "User");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "User");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Style");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Style");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "Style");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Style");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Recurrence");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Recurrence");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "Recurrence");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Recurrence");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "OneTimeVisitPayment");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "OneTimeVisitPayment");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "OneTimeVisitPayment");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "OneTimeVisitPayment");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "OneTimeVisit");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "OneTimeVisit");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "OneTimeVisit");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "OneTimeVisit");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Membership");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Membership");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "Membership");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Membership");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "GroupPayment");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "GroupPayment");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "GroupPayment");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "GroupPayment");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "GroupMemberLink");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "GroupMemberLink");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "GroupMemberLink");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "GroupMemberLink");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Group");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Group");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "Group");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Group");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EventParticipance");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "EventParticipance");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "EventParticipance");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "EventParticipance");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EventCoachSubstitution");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "EventCoachSubstitution");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "EventCoachSubstitution");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "EventCoachSubstitution");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Coach");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Coach");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "Coach");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Coach");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Client");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Client");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "Client");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Client");
        }
    }
}
