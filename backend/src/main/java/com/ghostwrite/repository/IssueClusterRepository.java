package com.ghostwrite.repository;

import com.ghostwrite.entity.IssueCluster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssueClusterRepository extends JpaRepository<IssueCluster, Long> {
    Optional<IssueCluster> findByClusterCode(String clusterCode);
    List<IssueCluster> findByCategory(String category);
    List<IssueCluster> findByDepartment(String department);
    List<IssueCluster> findAllByOrderByReportCountDesc();
}
