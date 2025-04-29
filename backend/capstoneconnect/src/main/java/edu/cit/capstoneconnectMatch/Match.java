package edu.cit.capstoneconnectMatch;

import edu.cit.capstoneconnectEntity.UserEntity;
import jakarta.persistence.*;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "matched_user_id")
    private UserEntity matchedUser;

    @Temporal(TemporalType.TIMESTAMP)
    private Date matchDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date cooldownUntil;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MatchStatus status = MatchStatus.PENDING;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    public enum MatchStatus {
        PENDING,    // Initial state when connection request is sent
        ACCEPTED,   // When the other user accepts the connection
        REJECTED,   // When the other user rejects the connection
        PASSED      // When a user passes on a match
    }

    // Default constructor
    public Match() {
        this.messages = new ArrayList<>();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public UserEntity getMatchedUser() {
        return matchedUser;
    }

    public void setMatchedUser(UserEntity matchedUser) {
        this.matchedUser = matchedUser;
    }

    public Date getMatchDate() {
        return matchDate;
    }

    public void setMatchDate(Date matchDate) {
        this.matchDate = matchDate;
    }

    public Date getCooldownUntil() {
        return cooldownUntil;
    }

    public void setCooldownUntil(Date cooldownUntil) {
        this.cooldownUntil = cooldownUntil;
    }

    public MatchStatus getStatus() {
        return status;
    }

    public void setStatus(MatchStatus status) {
        this.status = status;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public void addMessage(Message message) {
        messages.add(message);
        message.setMatch(this);
    }
} 