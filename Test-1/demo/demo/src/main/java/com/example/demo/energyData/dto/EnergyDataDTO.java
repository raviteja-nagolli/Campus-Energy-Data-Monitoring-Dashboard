package com.example.demo.energyData.dto;

import java.time.LocalDateTime;

public class EnergyDataDTO {
    private String id;
    private Integer buildingId;
    private LocalDateTime timeStamp;
    private Double energyUsage;

    public EnergyDataDTO() {
    }

    public EnergyDataDTO(String id, Integer buildingId, LocalDateTime timeStamp, Double energyUsage) {
        this.id = id;
        this.buildingId = buildingId;
        this.timeStamp = timeStamp;
        this.energyUsage = energyUsage;
    }

    public Integer getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(Integer buildingId) {
        this.buildingId = buildingId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
