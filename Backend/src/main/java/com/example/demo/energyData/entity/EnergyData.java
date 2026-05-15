package com.example.demo.energyData.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "energy_data")
public class EnergyData {
    @Id
    private String id;

    private Integer buildingId;

    private String buildingName;

    private LocalDateTime timeStamp;

    private Double energyUsage;

    public EnergyData() {
    }

    public EnergyData(String id, Integer buildingId, String buildingName, LocalDateTime timeStamp, Double energyUsage) {
        this.id = id;
        this.buildingId = buildingId;
        this.buildingName = buildingName;
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

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
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
