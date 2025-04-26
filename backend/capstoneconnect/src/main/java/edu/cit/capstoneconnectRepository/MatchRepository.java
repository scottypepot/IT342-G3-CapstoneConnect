package edu.cit.capstoneconnectRepository;

import edu.cit.capstoneconnectMatch.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    @Query("SELECT m FROM Match m WHERE (m.user.id = :userId1 AND m.matchedUser.id = :userId2) OR (m.user.id = :userId2 AND m.matchedUser.id = :userId1)")
    Optional<Match> findByUserIdAndMatchedUserId(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Query("SELECT m FROM Match m WHERE m.user.id = :userId OR m.matchedUser.id = :userId")
    List<Match> findMatchesByUserId(@Param("userId") Long userId);
} 