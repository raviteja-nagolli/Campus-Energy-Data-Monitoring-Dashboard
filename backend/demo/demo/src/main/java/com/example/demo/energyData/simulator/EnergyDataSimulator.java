package com.example.demo.energyData.simulator;

import com.example.demo.energyData.entity.EnergyData;
import com.example.demo.energyData.repository.EnergyDataRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.Month;

@Service
public class EnergyDataSimulator {
    private final EnergyDataRepository energyDataRepository;

    public EnergyDataSimulator(EnergyDataRepository energyDataRepository) {
        this.energyDataRepository = energyDataRepository;
    }

    Integer hour=LocalDateTime.now().getHour();
    DayOfWeek day=LocalDateTime.now().getDayOfWeek();
    Month month=LocalDateTime.now().getMonth();
    @Scheduled(fixedRate = 5000)
    public void generateData(){
        for(int i=1;i<7;i++) {
            double min=0;
            double max=0;
            if(i==1){
                if(day==DayOfWeek.SUNDAY || day==DayOfWeek.SATURDAY){
                    min=15;
                    max=20;
                }
                else if((hour>=9 && hour<11) || (hour>=15 && hour<17)) {
                    min=60;
                    max=70;
                }
                else if(hour>11 && hour<15){
                    min=110;
                    max=120;
                }
                else{
                    min=15;
                    max=20;
                }
            }
            else if(i==2){
                if(hour>=11 && hour<=16) {
                    min=220;
                    max=230;
                }
                else if((hour>16 && hour<=18) || (hour>=8 && hour<=10)){
                    min=120;
                    max=130;
                }
                else{
                    min=20;
                    max=30;
                }
            }
            else if(i==3){
                if(hour>=11 && hour<=16) {
                    min=170;
                    max=190;
                }
                else if((hour>16 && hour<=18) || (hour>=8 && hour<=10)){
                    min=90;
                    max=100;
                }
                else{
                    min=20;
                    max=30;
                }
            }
            else if(i==4){
                if(hour>=11 && hour<=16) {
                    min=90;
                    max=100;
                }
                else if((hour>16 && hour<=18) || (hour>=8 && hour<=10)){
                    min=50;
                    max=60;
                }
                else{
                    min=20;
                    max=30;
                }
            }
            else if(i==5){
                if(hour>=9 && hour<=16) {
                    min=80;
                    max=90;
                }
                else if((hour>16 && hour<=18) || (hour==8)){
                    min=120;
                    max=130;
                }
                else{
                    min=10;
                    max=15;
                }
            }
            else{
                if(month==Month.APRIL || month==Month.MAY){
                    min=min+50;
                    max=max+50;
                }
                if(hour>=18 && hour<=24) {
                    min=min+300;
                    max=max+310;
                }
                else if((hour>=6 && hour<9) || (hour>=13 && hour<=17)){
                    min=min+200;
                    max=max+210;
                }
                else{
                    min=min+50;
                    max=max+60;
                }
            }
            double energyUsage=min + Math.random() * (max-min);
            double rand=Math.random();
            double multiplier=1.0;
//            boolean forceAnomaly=true;
            if(rand<0.05){
                energyUsage=energyUsage*1.6;
            }
            if(rand<0.30) {
                if (i == 1) {
                    multiplier=1.61;
                } else if (i == 2) {
                    multiplier=1.33;
                } else if (i == 3 || i==5) {
                    multiplier=1.4;
                } else if (i == 4) {
                    double rand2=Math.random();
                    if (rand2 < 0.01) {
                        multiplier=2.26;
                    } else{
                        multiplier=1.63;
                    }
                } else if(i==6) {
                    multiplier=1.55;
                }
            }
            energyUsage=energyUsage*multiplier;
            EnergyData energyData = new EnergyData();
            energyData.setBuildingId(i);
            energyData.setTimeStamp(LocalDateTime.now());
            energyData.setEnergyUsage(energyUsage);
            if(energyData.getBuildingId()==1){
                energyData.setBuildingName("Admin Block");
            }
            else if(energyData.getBuildingId()==2){
                energyData.setBuildingName("CSE Block");
            }
            else if(energyData.getBuildingId()==4){
                energyData.setBuildingName("ECE Block");
            }
            else if(energyData.getBuildingId()==5){
                energyData.setBuildingName("Mechanical Block");
            }
            else if(energyData.getBuildingId()==3){
                energyData.setBuildingName("Library");
            }
            else{
                energyData.setBuildingName("Hostel");
            }
            energyDataRepository.save(energyData);
        }
    }
}
