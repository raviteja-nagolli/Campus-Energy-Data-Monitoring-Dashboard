package com.example.demo.energyData.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "energy_data")
public class EnergyData {
    @Id
    private String id;

    private Integer buildingId;

    private LocalDateTime timeStamp;

    private Double energyUsage;

    public EnergyData() {
    }

    public EnergyData(String id, Integer buildingId, LocalDateTime timeStamp, Double energyUsage) {
        this.id = id;
        this.buildingId = buildingId;
        this.timeStamp = timeStamp;
        this.energyUsage = energyUsage;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(Integer buildingId) {
        this.buildingId = buildingId;
    }

    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }

    public Double getEnergyUsage() {
        return energyUsage;
    }

    public void setEnergyUsage(Double energyUsage) {
        this.energyUsage = energyUsage;
    }
}
