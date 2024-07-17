using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class style2Memberships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "StyleId",
                table: "Membership",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Membership_StyleId",
                table: "Membership",
                column: "StyleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Membership_Style_StyleId",
                table: "Membership",
                column: "StyleId",
                principalTable: "Style",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Membership_Style_StyleId",
                table: "Membership");

            migrationBuilder.DropIndex(
                name: "IX_Membership_StyleId",
                table: "Membership");

            migrationBuilder.DropColumn(
                name: "StyleId",
                table: "Membership");
        }
    }
}
