/**
 * @flow
 */
import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'
import _ from 'lodash'
import { connect } from 'react-redux'
import ProgressImage, { Progress } from "./ProgressImage";
import ImageView from "./ImageView";
import { replaceBr } from "../../utils/common";
import { use4G } from "../../actions/settingAction";

const deviceWidth = Dimensions.get('window').width

class RootCard extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false,
      progress: 0,
      loadImg: props.loadImg
    }
  }

  state: {
    visible: boolean,
    progress: number,
    loadImg: boolean,
  }

  toggleVisible() {
    this.setState({
      visible: true,
    })
  }

  closeFun() {
    this.setState({
      visible: false,
    })
  }

  render() {
    const {
      id,
      bad, // 差
      good, // 赞
      comment_num,  // 评论数
      content,  // 文字内容
      user_name,  // 用户名
      user_pic, // 用户头像
      time, // 发布时间
      topic_content, // 主题
      pic, // 图片对象

    } = this.props.data
    const loadImgState  = this.state.loadImg
    const loadImgProps = this.props.loadImg
    const loadImg = loadImgProps ? loadImgProps : loadImgState
    // console.log('this.props.data:', this.props.data)
    const { width = 0, height = 0, path = '', name = '' } = pic || {}
    const imageWidth = deviceWidth - 80
    const imageHeight = height * imageWidth / width
    const imageContentHeight = imageHeight > 300 ? 300 : imageHeight
    const imageUrl = loadImg ? `https://image.haha.mx/${path}/big/${name}`: `https://image.haha.mx/${path}/small/${name}`
    return (
      <View
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          backgroundColor: '#F2F2F2',
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
          }}>
          <Image
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              marginRight: 5,
            }}
            source={{ uri: user_pic }}/>
          <View>
            <Text style={{ color: '#2A86F7' }}>{user_name}</Text>
            <Text style={{ fontSize: 12, color: '#C6C6C6' }}>{time}</Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
          }}
        >
          {
            !_.isEmpty(content) &&
            <View
              style={{ paddingBottom: 10 }}
            >
              <Text style={{ fontSize: 16, color: '#666666' }}>{replaceBr(content)}</Text>
            </View>
          }
          {
            !_.isEmpty(pic) &&
            <View>
              <TouchableWithoutFeedback
                onPress={loadImg ? () => this.toggleVisible(): () => this.setState({loadImg: true})}
              >
                <View
                  style={{
                    height: imageContentHeight,
                    overflow: 'hidden',
                  }}
                >
                  <ProgressImage
                    style={{ width: imageWidth, height: imageHeight }}
                    source={{ uri: imageUrl }}
                    indicator={() => <Progress progress={this.state.progress} showsText animated={false}/>}
                    onProgress={e => {
                      this.setState({
                        progress: e.nativeEvent.loaded / e.nativeEvent.total
                      })
                    }}
                  />
                  {
                    imageHeight > 250 &&
                    <View style={{
                      opacity: 0.4,
                      backgroundColor: '#000000',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      height: 30,
                      top: imageHeight > 300 ? 270: imageHeight - 30,
                      width: imageWidth,
                    }}>
                      <Text style={{ color: 'white' }}>点击查看全图</Text>
                    </View>
                  }
                </View>
              </TouchableWithoutFeedback>
              {
                this.state.visible && <ImageView
                  jid={id}
                  width={width}
                  height={height}
                  imageUrl={imageUrl}
                  deviceWidth={deviceWidth}
                  visible={this.state.visible}
                  closeFun={() => this.closeFun()}
                />
              }
            </View>
          }
        </View>
      </View>
    )
  }
}

const mapProps = (store) => {
  return {
    loadImg: use4G(store)
  }
}

const mapActions = (dispatch) => {
  return {}
}

export default connect(mapProps, mapActions)(RootCard)