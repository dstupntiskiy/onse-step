using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class grouppaymentfix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GroupMemberLink",
                table: "Payment",
                newName: "GroupMemberLinkId");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_GroupMemberLinkId",
                table: "Payment",
                column: "GroupMemberLinkId");

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_GroupMemberLink_GroupMemberLinkId",
                table: "Payment",
                column: "GroupMemberLinkId",
                principalTable: "GroupMemberLink",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payment_GroupMemberLink_GroupMemberLinkId",
                table: "Payment");

            migrationBuilder.DropIndex(
                name: "IX_Payment_GroupMemberLinkId",
                table: "Payment");

            migrationBuilder.RenameColumn(
                name: "GroupMemberLinkId",
                table: "Payment",
                newName: "GroupMemberLink");
        }
    }
}
