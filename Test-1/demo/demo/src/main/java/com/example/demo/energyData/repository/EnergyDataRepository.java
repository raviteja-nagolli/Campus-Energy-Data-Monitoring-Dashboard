package com.example.demo.energyData.repository;

import com.example.demo.energyData.entity.EnergyData;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EnergyDataRepository extends MongoRepository<EnergyData, String> {
    List<EnergyData> findByBuildingId(Integer buildingId);
    List<EnergyData> findByTimeStampBetween(LocalDateTime start, LocalDateTime end);
    List<EnergyData> findByTimeStampBetweenAndBuildingId(LocalDateTime start,LocalDateTime end,Integer buildingId);
}
