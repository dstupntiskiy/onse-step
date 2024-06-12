using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class grouppayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupMemberLink_Payment_PaymentId",
                table: "GroupMemberLink");

            migrationBuilder.DropIndex(
                name: "IX_GroupMemberLink_PaymentId",
                table: "GroupMemberLink");

            migrationBuilder.DropColumn(
                name: "PaymentId",
                table: "GroupMemberLink");

            migrationBuilder.AddColumn<Guid>(
                name: "GroupMemberLink",
                table: "Payment",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GroupMemberLink",
                table: "Payment");

            migrationBuilder.AddColumn<Guid>(
                name: "PaymentId",
                table: "GroupMemberLink",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GroupMemberLink_PaymentId",
                table: "GroupMemberLink",
                column: "PaymentId");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupMemberLink_Payment_PaymentId",
                table: "GroupMemberLink",
                column: "PaymentId",
                principalTable: "Payment",
                principalColumn: "Id");
        }
    }
}
