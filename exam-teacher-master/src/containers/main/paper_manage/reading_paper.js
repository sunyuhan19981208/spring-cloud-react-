import React from 'react'
import BreadcrumbCustom from '@components/BreadcrumbCustom'

import {Row,Col,Select,Input,Table, Icon, Divider,Button,Card,Tag,Modal} from 'antd'
const Option = Select.Option;
const Search = Input.Search;

import {Link} from 'react-router-dom'
import {withRouter} from "react-router-dom";

import ReadingCard from './subpage/reading_card'
import httpServer from '@components/httpServer.js'
import * as URL from '@components/interfaceURL.js'

class ReadingPaper extends React.Component {
  constructor(){
    super()
    this.state = {
      fillInList : [],
      shortAnswerList : [],
      programList : [],
      scoreList:[],
    }
    this.gapscorelist = [];
    this.shoscorelist = [];
    this.totalScore = 0;
  }

  getStuAnswer(instId){
    httpServer({
      url : URL.get_stu_answer
    },{
      submitId : instId,
    })
    .then((res)=>{
      let respDate = res.data.data;
      // console.log(res.data.data);
      let fillInList =[];
      let shortAnswerList=[];
      let scoreList=[];
      for(let i=0;i<respDate.length;i++) {
        if(respDate[i].type == '1') { //填空题
          fillInList.push(respDate[i]);
        }
        else if(respDate[i].type == '5') { //简答题
          shortAnswerList.push(respDate[i]);
        }
        var entry1 = {
          questionId: respDate[i].questionId,
          score: respDate[i].score,
        }
        scoreList.push(entry1);
      }
      this.gapscorelist.length = fillInList.length;
      this.shoscorelist.length = shortAnswerList.length;
      this.setState({
        fillInList : fillInList,
        shortAnswerList : shortAnswerList,
        scoreList:scoreList,
      })
    })
  }

  //老师打分框框改变
  scoreChange(type,i,value){
    if(type == '1') { //填空题
      this.gapscorelist[i] = value;
    }
    else if(type == '5') { //简答题
      this.shoscorelist[i] = value;
    }
  }

  //提交
  submitScore(){
    console.log(this.state.scoreList);
    //总分
    let totalScore = 0;
    let flag = false;
    for(let i = 0;i<this.gapscorelist.length;i++) {
      if(typeof this.gapscorelist[i] == "undefined") {
        flag = true;
        this.gapscorelist[i] = 0;
      }
      totalScore += parseInt(this.gapscorelist[i]);
    }

    for(let i = 0;i<this.shoscorelist.length;i++) {
      if(typeof this.shoscorelist[i] == "undefined") {
        flag = true;
        this.shoscorelist[i] = 0;
      }
      totalScore += parseInt(this.shoscorelist[i]);
    }

    if(flag) {
      Modal.warning({
        title: '您有题目还没有评分，请评分后再提交',
        okText : '确定'
      });
      return;
    }

    httpServer({
      url : URL.submit_score,
      method: "post",
    },{
      submitId :parseInt(this.props.match.params.instId),
      scoreList : this.state.scoreList,
      // gapscorelist : this.gapscorelist,
      // shoscorelist : this.shoscorelist,
      // totalScore : totalScore,
      // updateType : 2,
    })
    .then((res)=>{
      this.props.history.push(`/main/paper_manage/scoring/all_papers/${this.props.match.params.paperId}/${this.props.match.params.classId}`);
    })

  }

  componentWillMount(){
    this.getStuAnswer(this.props.match.params.instId);
    // alert(this.props.match.params.instId);
  }

  render(){
    return(
      <div>
        <BreadcrumbCustom pathList={['试卷管理','在线阅卷','所有试卷','正在阅卷']}></BreadcrumbCustom>
        <div className="reading-paper-content">
          <Row>
            <Button type="primary" className="f-r m-b-20"><Link to={`/main/paper_manage/scoring/all_papers/${this.props.match.params.paperId}/${this.props.match.params.classId}`}><Icon type="left" />返回</Link></Button>
          </Row>
          <div className="paper">
            <div className="m-b-20">
              <ReadingCard title="填空题" scoreChange={this.scoreChange.bind(this)} questionList={this.state.fillInList}></ReadingCard>
            </div>
            <div className="m-b-20">
              <ReadingCard title="简答题" scoreChange={this.scoreChange.bind(this)} questionList={this.state.shortAnswerList}></ReadingCard>
            </div>
            <div className="m-t-20 clearfix">
              <Button type="primary" className="f-r" onClick={this.submitScore.bind(this)}>提交</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(ReadingPaper);
