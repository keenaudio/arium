var audio; // global import

(function() {
  'use strict';


  var AudioPlayer = function() {
    this.playing = false;
    this.paused = false;
    this.stopped = true;
  };


  AudioPlayer.prototype.play = function play(scheduler, time) {
    //time input is ac.currentTime passed from main.js
    
      //if not playing, then play
    if (!this.playing) {
      console.log("playing");
      this.playTime = time;
      //if resuming from a pause
      if (this.paused) {
          console.log("pause resume");
          scheduler.play(this.pauseTime);
          //play all active sources at percents
          //console.log(activeSources);
          // activeSources.forEach(function(element, index){
          //     var percent = (current16thNote-element.sourceStartBar) / (element.sourceNode.buffer.duration/(secondsPerBeat*0.25));
          //     element.sourceNode.start(element.sourceNode.buffer.duration * percent);
              
          // });
          
       //   current16thNote = pauseBeat;
        //  playTime =  playTime - current16thNote*secondsPer16;
          //console.log(pauseBeat);
          
      }
    
     this.playing = !this.playing;
     this.paused = !this.playing;
     
    //clockTime = current16thNote*secondsPer16;
    
      if(this.playing){ 
      // nextNoteTime = ac.currentTime;
      // scheduler();
      // clockOutput();
        scheduler.play(ac.currentTime)
      }
      //if playing, then pause
      } else {
        // window.clearTimeout( timerID );
        // activeSources.forEach(function(element){
        //     element.sourceNode.stop(0);
        // });
        scheduler.stopAll();
        console.log("paused");
        this.playing = !this.playing;
        this.paused = !this.playing;
        
        this.pauseTime = time-playTime;
        //pauseBeat = k;
        
        //console.log(activeSources);
        //console.log(current16thNote);
      }
  }


  // export
  audio.Player = AudioPlayer;

})();