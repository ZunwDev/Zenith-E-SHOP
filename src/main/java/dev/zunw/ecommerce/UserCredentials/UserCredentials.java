package dev.zunw.ecommerce.UserCredentials;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "\"user_credentials\"")
public class UserCredentials {
    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "password_hash")
    private String passwordHash;
}
