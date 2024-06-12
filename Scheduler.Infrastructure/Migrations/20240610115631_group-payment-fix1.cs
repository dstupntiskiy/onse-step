using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class grouppaymentfix1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payment_GroupMemberLink_GroupMemberLinkId",
                table: "Payment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Payment",
                table: "Payment");

            migrationBuilder.RenameTable(
                name: "Payment",
                newName: "GroupPayment");

            migrationBuilder.RenameIndex(
                name: "IX_Payment_GroupMemberLinkId",
                table: "GroupPayment",
                newName: "IX_GroupPayment_GroupMemberLinkId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupPayment",
                table: "GroupPayment",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupPayment_GroupMemberLink_GroupMemberLinkId",
                table: "GroupPayment",
                column: "GroupMemberLinkId",
                principalTable: "GroupMemberLink",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupPayment_GroupMemberLink_GroupMemberLinkId",
                table: "GroupPayment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupPayment",
                table: "GroupPayment");

            migrationBuilder.RenameTable(
                name: "GroupPayment",
                newName: "Payment");

            migrationBuilder.RenameIndex(
                name: "IX_GroupPayment_GroupMemberLinkId",
                table: "Payment",
                newName: "IX_Payment_GroupMemberLinkId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Payment",
                table: "Payment",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_GroupMemberLink_GroupMemberLinkId",
                table: "Payment",
                column: "GroupMemberLinkId",
                principalTable: "GroupMemberLink",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
