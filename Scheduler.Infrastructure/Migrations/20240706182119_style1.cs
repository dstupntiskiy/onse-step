using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class style1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Style",
                table: "Group");

            migrationBuilder.DropColumn(
                name: "Style",
                table: "Coach");

            migrationBuilder.AddColumn<Guid>(
                name: "StyleId",
                table: "Group",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "StyleId",
                table: "Coach",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Group_StyleId",
                table: "Group",
                column: "StyleId");

            migrationBuilder.CreateIndex(
                name: "IX_Coach_StyleId",
                table: "Coach",
                column: "StyleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Coach_Style_StyleId",
                table: "Coach",
                column: "StyleId",
                principalTable: "Style",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Group_Style_StyleId",
                table: "Group",
                column: "StyleId",
                principalTable: "Style",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Coach_Style_StyleId",
                table: "Coach");

            migrationBuilder.DropForeignKey(
                name: "FK_Group_Style_StyleId",
                table: "Group");

            migrationBuilder.DropIndex(
                name: "IX_Group_StyleId",
                table: "Group");

            migrationBuilder.DropIndex(
                name: "IX_Coach_StyleId",
                table: "Coach");

            migrationBuilder.DropColumn(
                name: "StyleId",
                table: "Group");

            migrationBuilder.DropColumn(
                name: "StyleId",
                table: "Coach");

            migrationBuilder.AddColumn<string>(
                name: "Style",
                table: "Group",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Style",
                table: "Coach",
                type: "text",
                nullable: true);
        }
    }
}
