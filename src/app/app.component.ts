import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core"
import { range, sample } from "lodash-es"
import Vex from "vexflow"

const VF = Vex.Flow

function getRandom<MEMBER>(values: MEMBER[]): MEMBER {
    // sample has null and undefined hard coded for some reason
    return sample(values) as MEMBER
}

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

    private renderer!: Vex.Flow.Renderer
    private context!: Vex.IRenderContext

    ngAfterViewInit(): void {
        this.renderer = new VF.Renderer(this.notesRef.nativeElement, VF.Renderer.Backends.SVG)
        this.context = this.renderer.getContext()

        this.makeNotes(2)
    }

    makeNotes(count: number): void {
        const stave = new VF.Stave(10, 40, 150)
        this.renderer.resize(500, 200)
        stave.addClef("bass")
        stave.setContext(this.context).draw()

        const notes = range(0, count).reduce(acc => {

            const aNote = getRandom(noteInfo)
            const mod = getRandom(["b", "", "#"])

            const note = new VF.StaveNote({
                clef: "bass",
                keys: [`${aNote?.note}${mod}/${sample(aNote?.octaves)}`],
                duration: getRandom(["4", "8"])
            })

            return [...acc, mod === ""
                ? note
                : note.addAccidental(0, new VF.Accidental(mod))]
        }, [] as Vex.Flow.StaveNote[])

        const beams = VF.Beam.generateBeams(notes)
        VF.Formatter.FormatAndDraw(this.context, stave, notes)
        beams.forEach(b => b.setContext(this.context).draw())
    }
}
