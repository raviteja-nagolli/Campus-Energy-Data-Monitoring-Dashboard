package com.example.demo.energyData.service;

import com.example.demo.energyData.dto.EnergyDataDTO;
import com.example.demo.energyData.entity.EnergyData;
//import com.example.demo.energyData.exception.ResourceNotFoundException;
import com.example.demo.energyData.mapper.EnergyDataMapper;
import com.example.demo.energyData.repository.EnergyDataRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EnergyDataService {
    private final EnergyDataRepository energyDataRepository;
    private final EnergyDataMapper energyDataMapper;

    public EnergyDataService(EnergyDataRepository energyDataRepository, EnergyDataMapper energyDataMapper) {
        this.energyDataRepository = energyDataRepository;
        this.energyDataMapper = energyDataMapper;
    }

    public EnergyDataDTO addEnergyData(EnergyDataDTO energyDataDTO){
        EnergyData energyData=energyDataMapper.toEnergyData(energyDataDTO);
        energyData.setTimeStamp(LocalDateTime.now());
        EnergyData saved=energyDataRepository.save(energyData);
        return energyDataMapper.toEnergyDataDTO(saved);
    }

    public List<EnergyDataDTO> getEnergyData(){
        List<EnergyData> energyDataList=energyDataRepository.findAll();
        return energyDataList.stream().map(energyDataMapper::toEnergyDataDTO).toList();
    }

    public List<EnergyDataDTO> getEnergyDataByBuilding(Integer buildingId){
        List<EnergyData> energyDataList=energyDataRepository.findByBuildingId(buildingId);
//        if(energyDataList.isEmpty()){
//            throw new ResourceNotFoundException("No data found for building:"+buildingId);
//        }
        return energyDataList.stream().map(energyDataMapper::toEnergyDataDTO).toList();
    }

    public List<EnergyDataDTO> getEnergyDataByDate(LocalDateTime start, LocalDateTime end){
        List<EnergyData> energyDataList=energyDataRepository.findByTimeStampBetween(start,end);
        return energyDataList.stream().map(energyDataMapper::toEnergyDataDTO).toList();
    }

    public  List<EnergyDataDTO> getEnergyDataByDateAndBuilding(LocalDateTime start, LocalDateTime end, Integer buildingId){
        List<EnergyData> energyDataList=energyDataRepository.findByTimeStampBetweenAndBuildingId(start,end,buildingId);
        return energyDataList.stream().map(energyDataMapper::toEnergyDataDTO).toList();
    }
}
