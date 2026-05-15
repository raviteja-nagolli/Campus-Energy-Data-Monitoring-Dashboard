package com.example.demo.energyData.controller;

import com.example.demo.energyData.dto.EnergyDataDTO;
import com.example.demo.energyData.service.EnergyDataService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

//@CrossOrigin(origins = "http://localhost:5173")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("energydata")
public class EnergyDataController {
    private final EnergyDataService energyDataService;

    public EnergyDataController(EnergyDataService energyDataService) {
        this.energyDataService = energyDataService;
    }

    @PostMapping
    public EnergyDataDTO addEnergyData(@RequestBody EnergyDataDTO energyDataDTO){
        return energyDataService.addEnergyData(energyDataDTO);
    }

    @GetMapping
    public List<EnergyDataDTO> getEnergyData(){
        return energyDataService.getEnergyData();
    }

    @GetMapping("/filter/buildingId/{buildingId}")
    public List<EnergyDataDTO> getEnergyDataByBuildingId(@PathVariable Integer buildingId){
        return energyDataService.getEnergyDataByBuilding(buildingId);
    }

    @GetMapping("/filter/date")
    public List<EnergyDataDTO> getEnergyDataByDate(@RequestParam LocalDateTime start, @RequestParam LocalDateTime end){
        return energyDataService.getEnergyDataByDate(start,end);
    }

    @GetMapping("/filter")
    public List<EnergyDataDTO> getEnergyByDateAndBuilding(@RequestParam LocalDateTime start, @RequestParam LocalDateTime end, @RequestParam Integer buildingId){
        return energyDataService.getEnergyDataByDateAndBuilding(start,end,buildingId);
    }
}
