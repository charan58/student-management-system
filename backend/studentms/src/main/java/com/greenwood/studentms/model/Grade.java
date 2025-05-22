package com.greenwood.studentms.model;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "grade")
public class Grade implements Serializable {

    @EmbeddedId
    private GradeId id;

    @Column(length = 5)
    private String grade;

    // Relationships
    @MapsId("studentId")
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @MapsId("courseId")
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    public Grade() {}

    public Grade(GradeId id, String grade) {
        this.id = id;
        this.grade = grade;
    }

    // Getters and Setters

    public GradeId getId() {
        return id;
    }

    public void setId(GradeId id) {
        this.id = id;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}
