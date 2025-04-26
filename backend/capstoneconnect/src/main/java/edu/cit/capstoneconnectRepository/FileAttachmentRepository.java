package edu.cit.capstoneconnectRepository;

import edu.cit.capstoneconnectEntity.FileAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long> {
} 