import { AfterViewInit, Component } from "@angular/core"
import Vex from "vexflow"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const vf = new Vex.Flow.Factory({
      renderer: {elementId: "notes", width: 500, height: 200}
    })

    const score = vf.EasyScore()
    const system = vf.System()

    system.addStave({
      voices: [
        score.voice(score.notes("C#5/q, B4, A4, G#4", {stem: "up"}), {}),
        score.voice(score.notes("C#4/h, C#4", {stem: "down"}), {})
      ]
    }).addClef("treble").addTimeSignature("4/4")

    vf.draw()
  }
}
