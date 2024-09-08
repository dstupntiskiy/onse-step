﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Scheduler.Infrastructure.Data;

#nullable disable

namespace Scheduler.Infrastructure.Migrations
{
    [DbContext(typeof(OneStepContext))]
    [Migration("20240908140528_super-admin")]
    partial class superadmin
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Scheduler.Application.Entities.Client", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("CreateDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Phone")
                        .HasColumnType("text");

                    b.Property<string>("SocialMediaLink")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Client");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.Coach", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<bool>("Active")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("CreateDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid?>("StyleId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("StyleId");

                    b.ToTable("Coach");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.Event", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid?>("CoachId")
                        .HasColumnType("uuid");

                    b.Property<string>("Color")
                        .HasColumnType("text");

                    b.Property<DateTime?>("CreateDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("EndDateTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("EventType")
                        .HasColumnType("integer");

                    b.Property<Guid?>("GroupId")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid?>("RecurrenceId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("StartDateTime")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("CoachId");

                    b.HasIndex("GroupId");

                    b.HasIndex("RecurrenceId");

                    b.ToTable("Event");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.EventParticipance", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("ClientId")
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("CreateDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("EventId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("ClientId");

                    b.HasIndex("EventId");

                    b.ToTable("EventParticipance");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.Group", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<bool>("Active")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("CreateDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("StyleId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("StyleId");

                    b.ToTable("Group");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.GroupMemberLink", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("ClientId")
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("CreateDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("GroupId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("ClientId");

                    b.HasIndex("GroupId");

                    b.ToTable("GroupMemberLink");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.GroupPayment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<decimal>("Amount")
                        .HasColumnType("numeric");

                    b.Property<string>("Comment")
                        .HasColumnType("text");

                    b.Property<DateTime?>("CreateDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("GroupMemberLinkId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("GroupMemberLinkId");

                    b.ToTable("GroupPayment");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.Membership", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<decimal>("Amount")
                        .HasColumnType("numeric");

                    b.Property<Guid>("ClientId")
                        .HasColumnType("uuid");

                    b.Property<string>("Comment")
                        .HasColumnType("text");

                    b.Property<DateTime?>("CreateDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid?>("StyleId")
                        .HasColumnType("uuid");

                    b.Property<bool>("Unlimited")
                        .HasColumnType("boolean");

                    b.Property<int?>("VisitsNumber")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("ClientId");

                    b.HasIndex("StyleId");

                    b.ToTable("Membership");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.OneTimeVisit", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("ClientId")
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("CreateDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("EventId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("ClientId");

                    b.HasIndex("EventId");

                    b.ToTable("OneTimeVisit");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.OneTimeVisitPayment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<decimal>("Amount")
                        .HasColumnType("numeric");

                    b.Property<string>("Comment")
                        .HasColumnType("text");

                    b.Property<DateTime?>("CreateDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("OneTimeVisitId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("OneTimeVisitId");

                    b.ToTable("OneTimeVisitPayment");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.Recurrence", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("CreateDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("DaysOfWeekJson")
                        .HasColumnType("text");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("ExceptDatesJson")
                        .HasColumnType("text");

                    b.Property<DateTime?>("StartDate")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("Recurrence");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.Style", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<decimal>("BasePrice")
                        .HasColumnType("numeric");

                    b.Property<DateTime?>("CreateDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Style");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("CreateDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<byte[]>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<byte[]>("PasswordSalt")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<bool>("isSuperAdmin")
                        .HasColumnType("boolean");

                    b.HasKey("Id");

                    b.ToTable("User");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.Coach", b =>
                {
                    b.HasOne("Scheduler.Application.Entities.Style", "Style")
                        .WithMany()
                        .HasForeignKey("StyleId");

                    b.Navigation("Style");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.Event", b =>
                {
                    b.HasOne("Scheduler.Application.Entities.Coach", "Coach")
                        .WithMany()
                        .HasForeignKey("CoachId");

                    b.HasOne("Scheduler.Application.Entities.Group", "Group")
                        .WithMany()
                        .HasForeignKey("GroupId");

                    b.HasOne("Scheduler.Application.Entities.Recurrence", "Recurrence")
                        .WithMany()
                        .HasForeignKey("RecurrenceId");

                    b.Navigation("Coach");

                    b.Navigation("Group");

                    b.Navigation("Recurrence");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.EventParticipance", b =>
                {
                    b.HasOne("Scheduler.Application.Entities.Client", "Client")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Scheduler.Application.Entities.Event", "Event")
                        .WithMany()
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Client");

                    b.Navigation("Event");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.Group", b =>
                {
                    b.HasOne("Scheduler.Application.Entities.Style", "Style")
                        .WithMany()
                        .HasForeignKey("StyleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Style");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.GroupMemberLink", b =>
                {
                    b.HasOne("Scheduler.Application.Entities.Client", "Client")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Scheduler.Application.Entities.Group", "Group")
                        .WithMany()
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Client");

                    b.Navigation("Group");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.GroupPayment", b =>
                {
                    b.HasOne("Scheduler.Application.Entities.GroupMemberLink", "GroupMemberLink")
                        .WithMany()
                        .HasForeignKey("GroupMemberLinkId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("GroupMemberLink");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.Membership", b =>
                {
                    b.HasOne("Scheduler.Application.Entities.Client", "Client")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Scheduler.Application.Entities.Style", "Style")
                        .WithMany()
                        .HasForeignKey("StyleId");

                    b.Navigation("Client");

                    b.Navigation("Style");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.OneTimeVisit", b =>
                {
                    b.HasOne("Scheduler.Application.Entities.Client", "Client")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Scheduler.Application.Entities.Event", "Event")
                        .WithMany()
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Client");

                    b.Navigation("Event");
                });

            modelBuilder.Entity("Scheduler.Application.Entities.OneTimeVisitPayment", b =>
                {
                    b.HasOne("Scheduler.Application.Entities.OneTimeVisit", "OneTimeVisit")
                        .WithMany()
                        .HasForeignKey("OneTimeVisitId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("OneTimeVisit");
                });
#pragma warning restore 612, 618
        }
    }
}
