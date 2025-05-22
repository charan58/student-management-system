package com.greenwood.studentms.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name="student")
public class Student {

    @Id
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    @Column
    private String email;

    @Enumerated(EnumType.STRING)
    @Column
    private Gender gender;

    @Column
    private java.sql.Date dateOfBirth;

    @Column
    private String contactNumber;

    @Column
    private String parentName;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "is_approved", nullable = false)
    private Boolean isApproved;

    public Student(){};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Gender getGender() {
        return  gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public java.sql.Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(java.sql.Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Boolean getApproved() {
        return isApproved;
    }

    public void setApproved(Boolean approved) {
        isApproved = approved;
    }


}
