using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolify.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ConvertEmailToValueConverter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Email",
                table: "users",
                newName: "email");

            migrationBuilder.RenameIndex(
                name: "ix_users_set_email",
                table: "users",
                newName: "ix_users_email");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "email",
                table: "users",
                newName: "Email");

            migrationBuilder.RenameIndex(
                name: "ix_users_email",
                table: "users",
                newName: "ix_users_set_email");
        }
    }
}
