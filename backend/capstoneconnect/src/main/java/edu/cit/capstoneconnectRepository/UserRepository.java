package edu.cit.capstoneconnectRepository;

import edu.cit.capstoneconnectEntity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByOauthId(String oauthId);
    Optional<UserEntity> findByEmail(String email);
}

