import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core"
import { range, sample } from "lodash-es"
import Vex from "vexflow"

const VF = Vex.Flow

const noteInfo = [
    {
        note: "a",
        octaves: [2, 3]
    }, {
        note: "b",
        octaves: [2, 3]
    }, {
        note: "c",
        octaves: [3, 4]
    }, {
        note: "d",
        octaves: [3]
    }, {
        note: "e",
        octaves: [2, 3]
    }, {
        note: "f",
        octaves: [2, 3]
    }, {
        note: "g",
        octaves: [2, 3]
    }
]

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit {

    @ViewChild("notes") notesRef!: ElementRef<HTMLDivElement>

    timer = 1
    notes = []

    ngAfterViewInit(): void {
        const renderer = new VF.Renderer(this.notesRef.nativeElement, VF.Renderer.Backends.SVG)
        renderer.resize(500, 200)
        const context = renderer.getContext()
        const stave = new VF.Stave(10, 40, 150)
        stave.addClef("bass")
        stave.setContext(context).draw()

        const notes = range(0, 2).reduce(acc => {

            const aNote = sample(noteInfo)
            const mod = sample(["b", "", "#"])

            const note = new VF.StaveNote({
                clef: "bass",
                // tslint:disable-next-line:no-non-null-assertion
                keys: [`${aNote!.note}${mod}/${sample(aNote!.octaves)}`],
                // tslint:disable-next-line:no-non-null-assertion
                duration: sample(["4", "8"])!
            })

            return [...acc, mod === ""
                ? note
                // tslint:disable-next-line:no-non-null-assertion
                : note.addAccidental(0, new VF.Accidental(mod!))]
        }, [] as Vex.Flow.StaveNote[])

        const beams = VF.Beam.generateBeams(notes)
        VF.Formatter.FormatAndDraw(context, stave, notes)
        beams.forEach(b => b.setContext(context).draw())

    }
}
