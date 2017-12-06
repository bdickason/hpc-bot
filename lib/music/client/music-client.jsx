import React from 'react';
import {render} from 'react-dom';

// Detect hostname for socket.io to connect
const hostname = window && window.location && window.location.hostname;

// Libraries
import openSocket from 'socket.io-client';
const socket = openSocket(hostname + ':5000'); // Connect to the server to get client updates

// Components
import Nav from './components/nav/nav.jsx'
import Player from './components/player/player.jsx'
import Controls from './components/controls/controls.jsx'
import Playlist from './components/playlist/playlist.jsx'

import css from './music-client.css'

class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        playing: false,
        videoId: null,
        songs: [],
        metadata: [],
        muted: false,
        timestamp: null,
        clients: []
    };

    this.playPause = this.playPause.bind(this);
    this.muteUnmute = this.muteUnmute.bind(this);
    this.trackChange = this.trackChange.bind(this);
    this.skip = this.skip.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.updateState = this.updateState.bind(this);
    socket.on('state', this.updateState); // Receive state updates from server
  }

  render () {
    // Controls
    //   Skip button
    // Youtube video
    // Track metadata
    // Playlist
    // * Tracks
    return( <div>
              <Nav current="music" />
              <div className="container">
                <Player
                  videoId={this.state.videoId}
                  playing={this.state.playing}
                  muted={this.state.muted}
                  onEnd={this.end}
                  onMuteUnmute={this.muteUnmute}
                  clients={this.state.clients}
                />
                <Controls
                  playing={this.state.playing}
                  onPlayPause={this.playPause}
                  onSkip = {this.skip}
                  onAdd={(song) => this.add(song)}
                />
                <Playlist
                  playing={this.state.playing}
                  currentVideo={this.state.videoId}
                  songs={this.state.songs}
                  metadata={this.state.metadata}
                  onTrackChange={(song) => this.trackChange(song)}
                  onRemove={(song) => this.remove(song)} />
              </div>
            </div>);
  }

  updateState(state) {
    console.log(state);
    this.setState(state);
  }

  playPause() {
    let playing = this.state.playing;
    socket.emit('playing', !playing);
  }

  muteUnmute() {
    let muted = this.state.muted;
    this.setState({muted: !muted});
  }

  trackChange(song) {
    socket.emit('playSong', song);  // Tell the server to update the current song

    // Tell the server to play the song if we click on a playlist
    if(!this.state.playing) {
      socket.emit('playing', !this.state.playing);
    }

  }

  skip() {
    socket.emit('skipSong');
  }

  end() {
    socket.emit('endSong');
  }

  add(song) {
    if(song) {
      socket.emit('addSong', song);
    }
  }

  remove(song) {
    socket.emit('removeSong', song);
  }
}


render(<MusicPlayer/>, document.getElementById('music'));
