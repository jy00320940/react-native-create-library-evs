module.exports = platform => [{
  name: () => `${platform}/versions.gradle`,
  content: ({ packageIdentifier }) => `def deps = [:]

  /*——————————————————————————kotlin dependencies——————————————————————————*/
  def kotlin=[:]
  
  kotlin.version='1.3.11'
  
  deps.kotlin= kotlin
  
  def depend_kotlin(DependencyHandler handler) {
  
      handler.add( "implementation","org.jetbrains.kotlin:kotlin-stdlib-jdk7:$deps.kotlin.version")
  
  }
  deps.depend_kotlin = this.&depend_kotlin
  
  
  /*——————————————————————————android dependencies——————————————————————————*/
  def android=[:]
  
  android.minSdkVersion=16

  android.targetSdkVersion=28

  android.buildToolsVersion="28.0.3"

  android.v7='28.0.3'
  
  android.constraint_layout='1.1.3'
  
  deps.android= android
  
  def depend_android(DependencyHandler handler) {
  
      handler.add( "implementation","com.android.support:appcompat-v7:$deps.android.v7")
      handler.add( "implementation","com.android.support.constraint:constraint-layout:$deps.android.constraint_layout")
  
  }
  deps.depend_android = this.&depend_android
  
  /*——————————————————————————test dependencies——————————————————————————*/
  def test=[:]
  
  test.junit='4.12'
  
  test.runner='1.0.2'
  
  test.espresso_core='3.0.2'
  
  deps.test=test
  
  def depend_test(DependencyHandler handler) {
  
      handler.add( "testImplementation","junit:junit:$deps.test.junit")
      handler.add( "androidTestImplementation","com.android.support.test:runner:$deps.test.runner")
      handler.add( "androidTestImplementation","com.android.support.test.espresso:espresso-core:$deps.test.espresso_core")
  
  }
  deps.depend_test = this.&depend_test
  
  
  /*——————————————————————————room dependence——————————————————————————*/
  def room=[:]
  
  room.version='1.1.1'
  
  deps.room=room
  
  def depend_room(DependencyHandler handler) {
  
      handler.add( "implementation","android.arch.persistence.room:runtime:$deps.room.version")
      handler.add( "annotationProcessor","android.arch.persistence.room:compiler:$deps.room.version")
      handler.add( "implementation","android.arch.persistence.room:rxjava2:$deps.room.version")
      handler.add( "implementation", "android.arch.persistence.room:guava:$deps.room.version")
      handler.add( "testImplementation","android.arch.persistence.room:testing:$deps.room.version")
  }
  
  deps.depend_room = this.&depend_room
  
  
  
  
  /*——————————————————————————autosize dependence——————————————————————————*/
  def autosize=[:]
  
  autosize.version='1.1.2'
  
  deps.autosize=autosize
  
  def depend_autosize(DependencyHandler handler) {
  
      handler.add( "implementation","me.jessyan:autosize:$deps.autosize.version")
  }
  
  deps.depend_autosize = this.&depend_autosize
  
  
  
  
  /*——————————————————————————lombok dependence——————————————————————————*/
  def lombok=[:]
  
  lombok.version='1.18.6'
  
  deps.lombok= lombok
  
  def depend_lombok(DependencyHandler handler) {
      handler.add( "compileOnly","org.projectlombok:lombok:$deps.lombok.version")
      handler.add( "annotationProcessor","org.projectlombok:lombok:$deps.lombok.version")
  }
  deps.depend_lombok = this.&depend_lombok
  
  /*——————————————————————————repository——————————————————————————*/
  
  def repository(RepositoryHandler handler) {
      handler.maven { url "http://maven.aliyun.com/nexus/content/groups/public/" }
      handler.maven { url "https://maven.aliyun.com/repository/jcenter" }
      handler.maven { url "https://maven.aliyun.com/repository/google" }
  }
  ext.repository = this.&repository
  
  ext.deps=deps
`,
}, {
  name: () => `${platform}/build.gradle`,
  content: () => `
  buildscript {
  
    apply from: './versions.gradle'

    repository(repositories)

    dependencies {
        classpath 'com.android.tools.build:gradle:3.4.0'
    }

}

apply plugin: 'com.android.library'

android {

    compileSdkVersion 23

    buildToolsVersion deps.android.buildToolsVersion

    defaultConfig {
        minSdkVersion deps.android.minSdkVersion
        targetSdkVersion deps.android.targetSdkVersion
        versionCode 1
        versionName "1.0"
    }
    lintOptions {
        abortOnError false
    }
}
allprojects {
    repository(repositories)
}


dependencies {
    implementation 'com.facebook.react:react-native:+'
}
  `,
}, {
  name: () => `${platform}/src/main/AndroidManifest.xml`,
  content: ({ packageIdentifier }) => `
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="${packageIdentifier}">

</manifest>
  `,
}, {
  name: ({ packageIdentifier, name }) =>
    `${platform}/src/main/java/${packageIdentifier.split('.').join('/')}/${name}Module.java`,
  content: ({ packageIdentifier, name }) => `
package ${packageIdentifier};

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.Map;

import javax.annotation.Nullable;

public class ${name}Module extends ReactContextBaseJavaModule implements LifecycleEventListener {
  private final ReactApplicationContext reactContext;

  public ${name}Module(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.reactContext.addLifecycleEventListener(this);
  }

  @Override
  public String getName() {
    return "${name}";
  }

  @Nullable
  @Override
  public Map<String, Object> getConstants() {
    return super.getConstants();
  }

  @Override
  public void onHostResume() {

  }

  @Override
  public void onHostPause() {

  }

  @Override
  public void onHostDestroy() {

  }
}`,
}, {
  name: ({ packageIdentifier, name }) =>
    `${platform}/src/main/java/${packageIdentifier.split('.').join('/')}/${name}Package.java`,
  content: ({ packageIdentifier, name }) => `
package ${packageIdentifier};

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.JavaScriptModule;
public class ${name}Package implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
      return Arrays.<NativeModule>asList(new ${name}Module(reactContext));
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
      return Collections.emptyList();
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
      return super.getConstants();
    }
}`,
}];
