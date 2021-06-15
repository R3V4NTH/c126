import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions'

export default class CameraScreen extends React.Component {
    camera = null;

    state = {
        hasCameraPermission: null,
    };

    async componentDidMount() {
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const hasCameraPermission = (camera.status === 'granted');
        this.setState({ hasCameraPermission });
    };

    uploadImage = async (url) => {
          const fileToUpload = url;
          const data = new FormData();
          data.append('name', 'Image Upload');
          data.append('file_attachment', fileToUpload);
          let res = await axios(
            'https://76cb2499a36f.ngrok.io/predict-digit',
            {
              method: 'post',
              headers: {
                'Content-Type': 'multipart/form-data; ',
              },
              body: data,

            }
          );
          let responseJson = await res.json();
          if (responseJson.status == 1) {
            alert('Upload Successful');
          }
        
    };

    takePicture = async () => {
        if (this.camera) {
          let photo = await this.camera.takePictureAsync();
          var image=photo.uri
          this.uploadImage(image)
        }
      }

    render() {
        const { hasCameraPermission } = this.state;

        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return  <Text>Camera permissions must be allowed</Text>;
        } else {
        return (
            <View>
                
                <Camera
                    ref={ref => {this.camera = ref}}   
                />
                
                <TouchableOpacity
                  onPress={()=>this.takePicture()}
                  >
                </TouchableOpacity>
            </View>
        );
        
        };  
    };
};
