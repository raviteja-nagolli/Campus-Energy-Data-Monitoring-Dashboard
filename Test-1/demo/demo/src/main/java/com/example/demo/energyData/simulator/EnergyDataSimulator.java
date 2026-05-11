package com.example.demo.energyData.simulator;

import com.example.demo.energyData.entity.EnergyData;
import com.example.demo.energyData.repository.EnergyDataRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EnergyDataSimulator {
    private final EnergyDataRepository energyDataRepository;

    public EnergyDataSimulator(EnergyDataRepository energyDataRepository) {
        this.energyDataRepository = energyDataRepository;
    }

    @Scheduled(fixedRate = 5000)
    public void generateData(){
        for(int i=1;i<4;i++) {
            EnergyData energyData = new EnergyData();

            energyData.setBuildingId(i);
            energyData.setTimeStamp(LocalDateTime.now());
            energyData.setEnergyUsage(20 + Math.random() * 80);

            energyDataRepository.save(energyData);
        }
    }
}
