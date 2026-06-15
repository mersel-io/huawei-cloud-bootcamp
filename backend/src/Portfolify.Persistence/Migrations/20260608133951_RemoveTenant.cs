using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolify.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTenant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_users_tenants_tenant_id",
                table: "users");

            migrationBuilder.DropTable(
                name: "tenants");

            migrationBuilder.DropIndex(
                name: "ix_users_tenant_id",
                table: "users");

            migrationBuilder.DropIndex(
                name: "ix_tags_tenant_id",
                table: "tags");

            migrationBuilder.DropIndex(
                name: "ix_tags_tenant_id_name",
                table: "tags");

            migrationBuilder.DropIndex(
                name: "ix_skills_tenant_id",
                table: "skills");

            migrationBuilder.DropIndex(
                name: "ix_projects_tenant_id",
                table: "projects");

            migrationBuilder.DropIndex(
                name: "ix_profiles_tenant_id",
                table: "profiles");

            migrationBuilder.DropIndex(
                name: "ix_experiences_tenant_id",
                table: "experiences");

            migrationBuilder.DropIndex(
                name: "ix_educations_tenant_id",
                table: "educations");

            migrationBuilder.DropIndex(
                name: "ix_contact_messages_tenant_id",
                table: "contact_messages");

            migrationBuilder.DropColumn(
                name: "tenant_id",
                table: "users");

            migrationBuilder.DropColumn(
                name: "tenant_id",
                table: "tags");

            migrationBuilder.DropColumn(
                name: "tenant_id",
                table: "skills");

            migrationBuilder.DropColumn(
                name: "tenant_id",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "tenant_id",
                table: "profiles");

            migrationBuilder.DropColumn(
                name: "tenant_id",
                table: "experiences");

            migrationBuilder.DropColumn(
                name: "tenant_id",
                table: "educations");

            migrationBuilder.DropColumn(
                name: "tenant_id",
                table: "contact_messages");

            migrationBuilder.CreateIndex(
                name: "ix_tags_name",
                table: "tags",
                column: "name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_tags_name",
                table: "tags");

            migrationBuilder.AddColumn<Guid>(
                name: "tenant_id",
                table: "users",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "tenant_id",
                table: "tags",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "tenant_id",
                table: "skills",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "tenant_id",
                table: "projects",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "tenant_id",
                table: "profiles",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "tenant_id",
                table: "experiences",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "tenant_id",
                table: "educations",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "tenant_id",
                table: "contact_messages",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "tenants",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    domain = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    slug = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    updated_at_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tenants", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_users_tenant_id",
                table: "users",
                column: "tenant_id");

            migrationBuilder.CreateIndex(
                name: "ix_tags_tenant_id",
                table: "tags",
                column: "tenant_id");

            migrationBuilder.CreateIndex(
                name: "ix_tags_tenant_id_name",
                table: "tags",
                columns: new[] { "tenant_id", "name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_skills_tenant_id",
                table: "skills",
                column: "tenant_id");

            migrationBuilder.CreateIndex(
                name: "ix_projects_tenant_id",
                table: "projects",
                column: "tenant_id");

            migrationBuilder.CreateIndex(
                name: "ix_profiles_tenant_id",
                table: "profiles",
                column: "tenant_id");

            migrationBuilder.CreateIndex(
                name: "ix_experiences_tenant_id",
                table: "experiences",
                column: "tenant_id");

            migrationBuilder.CreateIndex(
                name: "ix_educations_tenant_id",
                table: "educations",
                column: "tenant_id");

            migrationBuilder.CreateIndex(
                name: "ix_contact_messages_tenant_id",
                table: "contact_messages",
                column: "tenant_id");

            migrationBuilder.CreateIndex(
                name: "ix_tenants_domain",
                table: "tenants",
                column: "domain",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_tenants_slug",
                table: "tenants",
                column: "slug",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_users_tenants_tenant_id",
                table: "users",
                column: "tenant_id",
                principalTable: "tenants",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
