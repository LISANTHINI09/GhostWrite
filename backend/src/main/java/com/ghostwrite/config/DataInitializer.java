package com.ghostwrite.config;

import com.ghostwrite.dto.request.AnonymousReportSubmitRequest;
import com.ghostwrite.entity.*;
import com.ghostwrite.repository.*;
import com.ghostwrite.service.AnonymousReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AnonymousReportRepository reportRepository;
    private final AnonymousReportService reportService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeDepartments();
        initializeUsers();
        initializeSeedReports();
    }

    private void initializeDepartments() {
        if (departmentRepository.count() > 0) return;

        List<Department> departments = List.of(
                Department.builder().name("Hostel Administration & Estate Office").code("HOSTEL").contactEmail("hostel.admin@inst.edu").description("Student residential welfare and mess management").build(),
                Department.builder().name("Academic Affairs & Dean's Secretariat").code("ACAD").contactEmail("dean.academics@inst.edu").description("Academic policy and curriculum supervision").build(),
                Department.builder().name("Dean of Faculty & Departmental Affairs").code("FACULTY").contactEmail("dean.faculty@inst.edu").description("Instructional standards and faculty conduct").build(),
                Department.builder().name("Office of Controller of Examinations").code("COE").contactEmail("coe@inst.edu").description("Testing schedules, evaluations and grading").build(),
                Department.builder().name("Civil & Estate Infrastructure Maintenance").code("CIVIL").contactEmail("estate@inst.edu").description("Physical campus infrastructure, water, and power").build(),
                Department.builder().name("Information Technology & Campus Network Center").code("IT").contactEmail("itcenter@inst.edu").description("Campus LAN, Wi-Fi networks and enterprise servers").build(),
                Department.builder().name("Campus Transportation Division").code("TRANS").contactEmail("transport@inst.edu").description("Fleet logistics and student transport routes").build(),
                Department.builder().name("Internal Complaints Committee (ICC)").code("ICC").contactEmail("icc.confidential@inst.edu").description("Confidential inquiry into harassment and equity concerns").build(),
                Department.builder().name("Anti-Ragging & Student Welfare Directorate").code("WELFARE").contactEmail("welfare@inst.edu").description("Campus anti-bullying and mental health safety").build(),
                Department.builder().name("Finance, Accounts & Bursar's Office").code("FINANCE").contactEmail("finance@inst.edu").description("Tuition fees, dues and institutional scholarships").build()
        );

        departmentRepository.saveAll(departments);
        log.info("Initialized {} institutional departments.", departments.size());
    }

    private void initializeUsers() {
        if (userRepository.count() > 0) return;

        String encodedPassword = passwordEncoder.encode("GhostWrite@2026");

        User admin = User.builder()
                .email("admin@ghostwrite.com")
                .password(encodedPassword)
                .fullName("Chief Administrative Officer")
                .role(Role.ROLE_ADMIN)
                .department("Central Institutional Administration")
                .active(true)
                .build();

        User authority = User.builder()
                .email("authority@ghostwrite.com")
                .password(encodedPassword)
                .fullName("Dr. Robert Vance (Hostel Warden & Estate Head)")
                .role(Role.ROLE_AUTHORITY)
                .department("Hostel Administration & Estate Office")
                .active(true)
                .build();

        User reviewer = User.builder()
                .email("reviewer@ghostwrite.com")
                .password(encodedPassword)
                .fullName("Prof. Eleanor Sterling (Ethics Moderator)")
                .role(Role.ROLE_REVIEWER)
                .department("Institutional Grievance Cell")
                .active(true)
                .build();

        userRepository.saveAll(List.of(admin, authority, reviewer));
        log.info("Initialized default users: admin@ghostwrite.com, authority@ghostwrite.com, reviewer@ghostwrite.com (Password: GhostWrite@2026)");
    }

    private void initializeSeedReports() {
        if (reportRepository.count() >= 20) return;

        record SeedData(
                ReporterType type,
                String category,
                String subcategory,
                ReportSeverity severity,
                String raw,
                String location,
                String date
        ) {}

        List<SeedData> seeds = List.of(
                new SeedData(ReporterType.STUDENT, "Hostel", "Water & Sanitation", ReportSeverity.HIGH,
                        "Hostel water in Block A 3rd floor is consistently muddy and brownish for the past 4 days. Many students have developed skin rashes. We reported this to the floor caretaker twice but no action was taken.", "Hostel Block A, 3rd Floor", "2026-10-04"),
                new SeedData(ReporterType.STUDENT, "Hostel", "Water & Sanitation", ReportSeverity.HIGH,
                        "Water quality in hostel Block A is very bad and smells like rust. We cannot drink or brush our teeth with it.", "Hostel Block A, East Wing", "2026-10-05"),
                new SeedData(ReporterType.STUDENT, "Hostel", "Mess & Catering", ReportSeverity.MEDIUM,
                        "The hostel dining hall food served on Tuesday dinner was undercooked and spoiled. Multiple students fell sick with stomach ache the following morning.", "Dining Hall 2", "2026-10-06"),
                new SeedData(ReporterType.STUDENT, "Technology / IT", "Wi-Fi & Network", ReportSeverity.MEDIUM,
                        "Campus Wi-Fi connectivity in Science Block B has been dropping every 5 minutes during lab hours, preventing students from completing coding practical exams.", "Science Block B, Room 204", "2026-10-03"),
                new SeedData(ReporterType.STUDENT, "Technology / IT", "Wi-Fi & Network", ReportSeverity.MEDIUM,
                        "The library Wi-Fi on the 2nd floor doesn't connect. When it connects the speed is under 50kbps making research paper downloads impossible.", "Central Library 2nd Floor", "2026-10-05"),
                new SeedData(ReporterType.STUDENT, "Academic", "Curriculum Scheduling", ReportSeverity.HIGH,
                        "End-semester examination schedule has two major departmental papers scheduled on the exact same day in consecutive slots without any preparation break.", "Academic Center", "2026-10-02"),
                new SeedData(ReporterType.STUDENT, "Examination", "Hall Ticket & Seating", ReportSeverity.MEDIUM,
                        "Hall ticket portal generated seating allotment for rooms that are under civil renovation in the old humanities block.", "Exam Controller Portal", "2026-10-01"),
                new SeedData(ReporterType.STUDENT, "Infrastructure", "Elevator & Safety", ReportSeverity.CRITICAL,
                        "The primary elevator in the 7-story Engineering Block jolted and stopped abruptly between the 4th and 5th floors with 8 students inside. The emergency alarm button was not functioning.", "Engineering Block Main Lift", "2026-10-07"),
                new SeedData(ReporterType.STAFF, "Infrastructure", "Air Conditioning & Power", ReportSeverity.LOW,
                        "AC unit in Faculty Cabin 402 has been leaking water onto books and electrical sockets for over two weeks.", "Faculty Wing Cabin 402", "2026-09-28"),
                new SeedData(ReporterType.STUDENT, "Transport", "Route Reliability", ReportSeverity.MEDIUM,
                        "Route 14 campus bus arrived 45 minutes late three times this week without notice, causing over 30 students to miss mandatory 8:30 AM laboratory lectures.", "Campus South Bus Bay", "2026-10-06"),
                new SeedData(ReporterType.STUDENT, "Transport", "Bus Safety", ReportSeverity.HIGH,
                        "Bus 08 is severely overcrowded with students standing dangerously on the footboard. Driver is speeding on highway curves.", "Outer Ring Road Route", "2026-10-05"),
                new SeedData(ReporterType.STUDENT, "Faculty", "Class Conduct", ReportSeverity.MEDIUM,
                        "Lecturer in Advanced Statistics regularly cancels morning classes at the last minute and schedules makeup classes on Sunday mornings without consensus.", "Mathematics Dept", "2026-09-30"),
                new SeedData(ReporterType.STAFF, "Administration", "Reimbursement Delays", ReportSeverity.LOW,
                        "Conference travel grant reimbursement claims submitted three months ago are stuck between accounts and registrar office without status updates.", "Accounts Division", "2026-09-20"),
                new SeedData(ReporterType.STUDENT, "Fees", "Late Fee Waiver", ReportSeverity.MEDIUM,
                        "Online payment gateway timed out on the deadline evening deducting fee from bank account, but portal registered late fee penalty of Rs. 1500.", "Finance Portal", "2026-10-02"),
                new SeedData(ReporterType.STUDENT, "Library", "Book Availability", ReportSeverity.LOW,
                        "Only 2 copies of prescribed textbook for Distributed Systems are in circulation for a class of 180 students in semester 7.", "Departmental Library", "2026-09-25"),
                new SeedData(ReporterType.STUDENT, "Laboratory", "Equipment Maintenance", ReportSeverity.HIGH,
                        "Over half of the digital oscilloscopes in Electronics Lab 3 have faulty probes and distorted display signals, impacting project calibration.", "VLSI & Electronics Lab 3", "2026-10-04"),
                new SeedData(ReporterType.STUDENT, "Safety", "Lighting Deficiencies", ReportSeverity.HIGH,
                        "Pathway connecting Girls Hostel Block D to the Central Library has 4 broken streetlights creating a dark and unsafe stretch after 7:30 PM.", "North Quadrangle Pathway", "2026-10-07"),
                new SeedData(ReporterType.STUDENT, "Harassment", "Statutory Petition", ReportSeverity.CRITICAL,
                        "Certain senior students in the sports complex have been intimidating junior club members and making inappropriate verbal remarks during evening training.", "Sports Complex Pavilion", "2026-10-06"),
                new SeedData(ReporterType.STUDENT, "Bullying", "Disciplinary Concern", ReportSeverity.HIGH,
                        "Hostel mess line cutting and aggressive intimidation by a group of senior residents targeting 1st year boarders.", "Dining Hall 1 Entrance", "2026-10-03"),
                new SeedData(ReporterType.OTHER, "Administration", "Campus Entry Access", ReportSeverity.LOW,
                        "Visitor gate passes take over 35 minutes at Gate 2 due to manual physical ledger entry while biometric scanner lies disconnected.", "Main Campus Gate 2", "2026-09-29")
        );

        for (SeedData s : seeds) {
            AnonymousReportSubmitRequest req = new AnonymousReportSubmitRequest();
            req.setReporterType(s.type());
            req.setCategory(s.category());
            req.setSubcategory(s.subcategory());
            req.setSeverity(s.severity());
            req.setRawDescription(s.raw());
            req.setLocation(s.location());
            req.setIncidentDate(s.date());

            reportService.submitAnonymousReport(req);
        }

        log.info("Successfully seeded 20 realistic institutional reports with AI Ghostwritten documentation and cluster links.");
    }
}
