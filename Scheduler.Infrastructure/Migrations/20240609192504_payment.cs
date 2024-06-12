using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class payment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PaymentId",
                table: "GroupMemberLink",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Payment",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Amount = table.Column<int>(type: "integer", nullable: false),
                    Comment = table.Column<string>(type: "text", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payment", x => x.Id);
                });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupMemberLink_Payment_PaymentId",
                table: "GroupMemberLink");

            migrationBuilder.DropTable(
                name: "Payment");

            migrationBuilder.DropIndex(
                name: "IX_GroupMemberLink_PaymentId",
                table: "GroupMemberLink");

            migrationBuilder.DropColumn(
                name: "PaymentId",
                table: "GroupMemberLink");
        }
    }
}
