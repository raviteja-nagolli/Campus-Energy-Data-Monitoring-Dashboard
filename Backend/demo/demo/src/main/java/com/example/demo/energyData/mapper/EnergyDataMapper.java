package com.example.demo.energyData.mapper;

import com.example.demo.energyData.dto.EnergyDataDTO;
import com.example.demo.energyData.entity.EnergyData;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EnergyDataMapper {
    public EnergyData toEnergyData(EnergyDataDTO energyDataDTO);
    public EnergyDataDTO toEnergyDataDTO(EnergyData energyData);
}
