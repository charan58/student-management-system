package com.greenwood.studentms.controller;

import com.greenwood.studentms.model.Enrollment;
import com.greenwood.studentms.model.Grade;
import com.greenwood.studentms.model.Student;
import com.greenwood.studentms.repository.EnrollmentRepository;
import com.greenwood.studentms.repository.GradeRepository;
import com.greenwood.studentms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.io.font.constants.StandardFonts;




@RestController
@RequestMapping("/student")
@CrossOrigin(origins = "http://localhost:4000")
public class StudentController {

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    EnrollmentRepository enrollmentRepository;

    @Autowired
    GradeRepository gradeRepository;

    @GetMapping("/{studentId}/profile")
    public ResponseEntity<?> getStudentProfile (@PathVariable Long studentId){
        Optional<Student> student = studentRepository.findById(studentId);

        Map<String, Object> response = new HashMap<>();

        response.put("name", student.get().getFullName());
        response.put("email", student.get().getEmail());
        response.put("phoneNumber", student.get().getContactNumber());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{studentId}/courses")
    public ResponseEntity<?> getStudentCourses(@PathVariable Long studentId){
        List<Enrollment> enrollments = enrollmentRepository.findStudentCoursesById(studentId);

        List<Map<String, Object>> courses = enrollments.stream()
                .map(e -> {
                    Map<String, Object> courseMap = new HashMap<>();
                    courseMap.put("name", e.getCourse().getName());
                    courseMap.put("id", e.getCourse().getId());
                    return courseMap;
                })
                .toList();

        return ResponseEntity.ok(Map.of("courses", courses));
    }

    @GetMapping("/{studentId}/grades")
    public ResponseEntity<?> getStudentGrades(@PathVariable Long studentId) {
        List<Grade> grades = gradeRepository.findByStudent_Id(studentId);

        List<Map<String, Object>> gradeList = grades.stream()
                .map(g -> {
                    Map<String, Object> gradeMap = new HashMap<>();
                    gradeMap.put("courseName", g.getCourse().getName());
                    gradeMap.put("grade", g.getGrade());
                    return gradeMap;
                })
                .toList();

        return ResponseEntity.ok(Map.of("grades", gradeList));
    }


    @GetMapping("/{studentId}/gpa")
    public ResponseEntity<?> getStudentGPA(@PathVariable Long studentId) {
        List<Grade> grades = gradeRepository.findByStudent_Id(studentId);

        if (grades.isEmpty()) {
            return ResponseEntity.ok(Map.of("gpa", "N/A"));
        }

        double totalPoints = 0;
        double totalCredits = 0;

        for (Grade grade : grades) {
            double gradePoint = getGradePoint(grade.getGrade());
            totalPoints += gradePoint * grade.getCourse().getCredits();
            totalCredits += grade.getCourse().getCredits();
        }

        double gpa = totalPoints / totalCredits;
        gpa = Math.round(gpa * 100)/ 100.0;
        return ResponseEntity.ok(Map.of("gpa", gpa));
    }

    private double getGradePoint(String grade) {
        return switch (grade) {
            case "A" -> 5.0;
            case "B" -> 3.5;
            case "C" -> 2.0;
            default -> 0.0;
        };
    }

    @GetMapping("/{studentId}/report")
    public ResponseEntity<InputStreamResource> downloadStudentReport(@PathVariable Long studentId) throws IOException {
        // Fetch grades for the student
        List<Grade> grades = gradeRepository.findByStudent_Id(studentId);

        if (grades.isEmpty()) {
            return ResponseEntity.status(404).body(null); // No report if no grades exist
        }

        // Create a PDF report (this can be any report generation logic)
        byte[] reportData = generateStudentReport(grades);

        // Send the PDF as a response
        ByteArrayInputStream bis = new ByteArrayInputStream(reportData);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=student_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    // This is a placeholder method for generating the report in PDF format

    private byte[] generateStudentReport(List<Grade> grades) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Create fonts
            PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont regularFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

            // School Title with bold font and center alignment
            Paragraph schoolTitle = new Paragraph("Greenwood High School")
                    .setFont(boldFont)
                    .setFontSize(20);
            document.add(schoolTitle);

            document.add(new Paragraph("\n"));

            // Student Info (regular font)
            Student student = grades.get(0).getStudent();
            document.add(new Paragraph("Name: " + student.getFullName()).setFont(regularFont));
            document.add(new Paragraph("Email: " + student.getEmail()).setFont(regularFont));
            document.add(new Paragraph("\n"));

            // Grades Table with columns
            float[] columnWidths = {200f, 100f, 100f};
            Table table = new Table(columnWidths);

            // Header cells with bold font
            table.addHeaderCell(new Cell().add(new Paragraph("Subject").setFont(boldFont)));
            table.addHeaderCell(new Cell().add(new Paragraph("Grade").setFont(boldFont)));
            table.addHeaderCell(new Cell().add(new Paragraph("Credits").setFont(boldFont)));

            double totalPoints = 0;
            double totalCredits = 0;

            for (Grade grade : grades) {
                String courseName = grade.getCourse().getName();
                String gradeValue = grade.getGrade();
                double credits = grade.getCourse().getCredits();

                double gradePoint = getGradePoint(gradeValue);
                totalPoints += gradePoint * credits;
                totalCredits += credits;

                table.addCell(new Cell().add(new Paragraph(courseName).setFont(regularFont)));
                table.addCell(new Cell().add(new Paragraph(gradeValue).setFont(regularFont)));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(credits)).setFont(regularFont)));
            }

            document.add(table);
            document.add(new Paragraph("\n"));

            // GPA with bold font
            if (totalCredits > 0) {
                double gpa = Math.round((totalPoints / totalCredits) * 100.0) / 100.0;
                document.add(new Paragraph("CGPA: " + gpa+"/ 5.0").setFont(boldFont));
            } else {
                document.add(new Paragraph("CGPA: N/A").setFont(boldFont));
            }

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        }
    }




}
