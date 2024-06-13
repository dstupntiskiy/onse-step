using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class onetimevisit2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "OneTimeVisitId",
                table: "OneTimeVisitPayment",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_OneTimeVisitPayment_OneTimeVisitId",
                table: "OneTimeVisitPayment",
                column: "OneTimeVisitId");

            migrationBuilder.AddForeignKey(
                name: "FK_OneTimeVisitPayment_OneTimeVisit_OneTimeVisitId",
                table: "OneTimeVisitPayment",
                column: "OneTimeVisitId",
                principalTable: "OneTimeVisit",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OneTimeVisitPayment_OneTimeVisit_OneTimeVisitId",
                table: "OneTimeVisitPayment");

            migrationBuilder.DropIndex(
                name: "IX_OneTimeVisitPayment_OneTimeVisitId",
                table: "OneTimeVisitPayment");

            migrationBuilder.DropColumn(
                name: "OneTimeVisitId",
                table: "OneTimeVisitPayment");
        }
    }
}
