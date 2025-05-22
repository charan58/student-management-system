package com.greenwood.studentms.controller;


import com.greenwood.studentms.model.*;
import com.greenwood.studentms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/teacher")
@CrossOrigin("http://localhost:4000")
public class TeacherController {

    @Autowired
    TeacherRepository teacherRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    EnrollmentRepository enrollmentRepository;

    @Autowired
    GradeRepository gradeRepository;

    @Autowired
    StudentRepository studentRepository;


    // GET TEACHER's COURSE

    @GetMapping("/my-courses/{teacherId}")
    public ResponseEntity<?> getTeacherCourses(@PathVariable Long teacherId) {
        List<Course> courses = courseRepository.findCoursesByTeacherId(teacherId);

        List<Map<String, Object>> response = courses.stream().map(course -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", course.getId());
            map.put("name", course.getName());
            map.put("description", course.getDescription());
            map.put("credits", course.getCredits());
            return map;
        }).toList();

        return ResponseEntity.ok(Map.of(
                "message", "My Courses",
                "payload", response
        ));
    }

//    GET STUDENTS UNDER TEACHER's COURSE
    @GetMapping("/{teacherId}/enrollments")
    public ResponseEntity<?> getEnrolledStudents(@PathVariable Long teacherId){
        List<Enrollment> enrollments = enrollmentRepository.findEnrollmentsByTeacherId(teacherId);

        List<Map<String, Object>> payload = enrollments.stream().map(e-> {
            Map<String, Object> map = new HashMap<>();
            map.put("studentId", e.getStudentId());
            map.put("studentName",e.getStudent().getFullName());
            map.put("courseName", e.getCourse().getName());
            return map;
        }).toList();

        return ResponseEntity.ok(Map.of(
                "message", "Students enrolled in my courses",
                "payload", payload
        ));
    }

//    GET STUDENT COURSES
    @GetMapping("/{studentId}/courses")
    public ResponseEntity<?> getStudentCourses(@PathVariable Long studentId) {
    List<Enrollment> enrollments = enrollmentRepository.findStudentCoursesById(studentId);

    if (enrollments.isEmpty()) {
        return ResponseEntity.noContent().build();
    }

    // Extract course names
        List<Map<String, Object>> courses = enrollments.stream()
                .map(e -> {
                    Map<String, Object> courseMap = new HashMap<>();
                    courseMap.put("id", e.getCourse().getId());
                    courseMap.put("name", e.getCourse().getName());
                    return courseMap;
                })
                .toList();

    // Build custom response
    Map<String, Object> response = new HashMap<>();
    response.put("studentId", studentId);
    response.put("courses", courses);

    return ResponseEntity.ok(response);
}

    @PutMapping("/grades/{studentId}")
    public ResponseEntity<?> upsertGrade(@PathVariable Long studentId,
                                         @RequestBody Map<String, Object> payload){

        try{
            Long courseId = Long.parseLong(payload.get("courseId").toString());
            String gradeValue = payload.get("grade").toString();

            GradeId gradeId = new GradeId(studentId, courseId);
            Optional<Grade> existingGrade = gradeRepository.findById(gradeId);

            Grade grade;

            if(existingGrade.isPresent()){
                grade = existingGrade.get();
                grade.setGrade(gradeValue);
            }else{
                grade = new Grade();
                grade.setId(gradeId);
                grade.setGrade(gradeValue);

                Student student = studentRepository.findById(studentId).orElseThrow();
                Course course = courseRepository.findById(courseId).orElseThrow();
                grade.setStudent(student);
                grade.setCourse(course);
            }

            gradeRepository.save(grade);

            return ResponseEntity.ok(Map.of(
                    "message", "The grade was upserted.",
                    "studentId", studentId,
                    "courseId", courseId,
                    "grade", gradeValue
            ));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Invalid input or data: "+e.getMessage());
        }
    }

    @GetMapping("/courses-count/{teacherId}")
    public ResponseEntity<?> getCourseCountsPerTeacher(@PathVariable Long teacherId) {
        List<Object[]> results = courseRepository.getCourseCountsPerTeacher(teacherId);

        List<Map<String, Object>> payload = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("teacherId", row[0]);
            entry.put("courseCount", row[1]);
            payload.add(entry);
        }

        return ResponseEntity.ok(Map.of(
                "message", "Course count per teacher",
                "payload", payload
        ));
    }


    @GetMapping("/students-count/{teacherId}")
    public ResponseEntity<?> getStudentCountsPerTeacher(@PathVariable Long teacherId) {
        List<Object[]> results = enrollmentRepository.getStudentCountsPerTeacher(teacherId);

        List<Map<String, Object>> payload = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("teacherId", row[0]);
            entry.put("teacherName", row[1]);
            entry.put("studentCount", row[2]);
            payload.add(entry);
        }

        return ResponseEntity.ok(Map.of(
                "message", "Student count per teacher",
                "payload", payload
        ));
    }



}
