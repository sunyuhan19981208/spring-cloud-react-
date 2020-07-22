package com.example.serviceexam.controller;

import com.example.serviceexam.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.awt.*;
import java.util.HashMap;

@RestController
@CrossOrigin
public class ExamController {
    @Autowired
    ExamService examService;
    @RequestMapping(value="/createExam",produces = {MediaType.APPLICATION_JSON_VALUE})
    HashMap<String,Object>createExam(@RequestParam("className")String className,@RequestParam("paperId")int paperId,@RequestParam("startTime")String startTime,
                                     @RequestParam("endTime")String endTime,@RequestParam("examName")String examName){
        examService.createExam(examName,startTime,endTime,paperId,className);
        return new HashMap<String,Object>(){
            {
                put("respCode",1);
                put("respMsg","试卷添加成功");
            }
        };
    }
}
