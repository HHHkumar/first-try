# The Turning Arrow: Phasors and Impedance

Narration script, draft 1. English, about 13 minutes. Series 2 (Alternating Current), video 3 of 6.

Lines in plain text are spoken. Lines marked **On screen** describe the picture and are not spoken. **Hero scene** marks a showpiece shot. A timeline strip runs along the bottom of the frame, as in the earlier videos. The look is "Aurora": voltage in pink, current in cyan throughout.

---

## 1. Three plus four makes five

**On screen:** A resistor and a coil in series on an alternating supply. A voltmeter across the resistor reads 60. A voltmeter across the coil reads 80. A third voltmeter across both: the digits spin and settle, not on 140, but on 100. Then the three voltage waves, drawn one above the other: the two smaller ones reach their crests at different moments.

Here is a circuit that seems to break arithmetic.

A resistor and a coil, connected one after the other, on an alternating supply. Put a voltmeter across the resistor. It reads sixty volts. Put it across the coil. Eighty volts.

Now put the meter across both together. You would expect a hundred and forty. It reads one hundred.

Nothing is broken. The meters are right, all three of them. The trouble is that these are alternating voltages, and in the last video we saw that a coil's voltage is out of step with a resistor's. The two reach their peaks at different moments. When one is at its crest, the other is passing through zero. So they never add up in full.

To add voltages like these, we need a way to keep track of two things at once: how big each wave is, and when it peaks. In this video we meet the tool that does it. It turns every wave into an arrow, and it turns this puzzle into a triangle.

---

## 2. A wave is a turning arrow

**On screen:** **Hero scene:** an arrow of light, fixed at its tail, turning steadily like the hand of a clock running backwards. A bright point at its tip casts its height sideways onto a ribbon, which unrolls and shows a sine wave. The arrow is made longer: the wave grows taller. The arrow is started from a different angle: the wave slides along. A second arrow is added on the same pivot, a quarter turn behind the first, and its wave appears, a quarter cycle late.

Go back to where the sine wave came from. In the first video of this series, we watched a loop turning in a magnetic field, and we plotted the height of one point on it as time went by. Out came the wave.

So strip the picture down. Forget the loop and the magnet. Keep only an arrow, turning at a steady rate about one end. Watch the height of its tip. It rises, falls, goes negative, and returns. One full turn of the arrow is one full cycle of the wave.

Everything about the wave is there in the arrow. The length of the arrow is the height of the wave: its peak. How fast the arrow turns is the frequency. And the angle the arrow starts from decides when the wave reaches its crest.

Now draw a second arrow on the same pivot, a quarter of a turn behind the first, and let them turn together. The second wave comes out a quarter of a cycle late. The gap in timing between two waves is simply the angle between their two arrows.

That is why, from the very beginning, we have measured phase in degrees.

---

## 3. Stop the clock

**On screen:** Timeline: 1893. Several arrows of different lengths turning together about one pivot, like the spokes of a wheel. The camera begins to turn with them, and they appear to stand still. Only their lengths and the angles between them remain. A portrait in line of light: a small man at a desk covered in paper, a cigar in his hand. Chicago, 1893.

Here is the step that makes this useful.

In any one circuit, every voltage and every current alternates at the same frequency. So all of their arrows turn at the same rate. They go round together, like the spokes of a wheel. The angles between them never change.

So we do not need to watch them turn. Imagine riding round with them. From there, every arrow stands still. What is left is a simple drawing: a few arrows, each with a length and a direction. The length says how big. The direction says when.

An arrow used like this is called a phasor. And a drawing of them is a phasor diagram.

The idea was set out in eighteen ninety-three, at a congress of electrical engineers in Chicago, by Charles Proteus Steinmetz. He had arrived in America four years earlier as a penniless refugee from Germany. In the same year an American, Arthur Kennelly, published the same idea. Until then, working out an alternating current circuit meant wrestling with waves and the mathematics of change. After them, it meant drawing arrows and measuring a triangle. One engineer said that Steinmetz had turned a problem in calculus into a problem in algebra.

One convention before we go on. We draw each arrow with a length equal to the RMS value, not the peak, because RMS is what our meters read.

---

## 4. The three components, as arrows

**On screen:** Three small diagrams side by side. In each, a cyan arrow for the current lies along the same direction. For the resistor, the pink voltage arrow lies along it. For the coil, the pink arrow points a quarter turn ahead of the current. For the capacitor, a quarter turn behind. Above each, faintly, the pair of waves from the last video, so the arrows and the waves can be matched.

Now put last video's results into this new language.

For a resistor, voltage and current are in step. So their two arrows point the same way.

For a coil, the current lags the voltage by a quarter of a cycle. So the voltage arrow points a quarter turn ahead of the current arrow. Ninety degrees ahead.

For a capacitor, it is the other way round. The voltage arrow points ninety degrees behind the current arrow.

And the lengths? Ohm's law still gives them, with reactance standing in for resistance where it is needed. The voltage across a resistor is the current times the resistance. Across a coil, the current times its reactance. Across a capacitor, the current times its reactance.

That is all we need.

---

## 5. Adding arrows

**On screen:** **Hero scene:** the resistor and coil in series again, with the same current flowing through both, drawn as one cyan arrow pointing to the right. The resistor's voltage arrow, sixty long, is laid along it. From its tip, the coil's voltage arrow, eighty long, is drawn straight upward. A third arrow closes the triangle from the start to the finish: one hundred. The squares on the three sides light up: 3 600, 6 400, 10 000. Then, to check, the three waves are drawn and added point by point, and the sum matches the long arrow's wave exactly.

Back to the puzzle. A resistor and a coil in series.

Because they are in series, the same current flows through both. So start with the current, and draw its arrow pointing to the right. Everything else is measured from it.

The resistor's voltage is in step with the current. So its arrow also points to the right. Sixty volts long.

The coil's voltage is a quarter turn ahead of the current. So its arrow points straight up. Eighty volts long.

Now add them. And arrows are not added like plain numbers. They are added tip to tail. Put the start of the second arrow at the tip of the first. The total is the arrow from the very beginning to the very end.

Look at the shape. A right-angled triangle, with sides of sixty and eighty. And you may remember the rule for such a triangle: square the two short sides, add them, and take the square root. Sixty squared is three thousand six hundred. Eighty squared is six thousand four hundred. Together, ten thousand. And the square root of ten thousand is one hundred.

One hundred volts. Exactly what the meter said.

It is the same reason that walking three kilometres east and then four kilometres north leaves you five kilometres from home, not seven.

---

## 6. Impedance

**On screen:** Timeline: 1886. The voltage triangle, with every side divided by the current, two amperes: the sides become 30 ohms, 40 ohms and 50 ohms. The triangle is labelled: resistance along the bottom, reactance up the side, and the long side given a new name. *Z = √(R² + X²)*. The angle at the corner is marked: 53 degrees. Then *V = I × Z*.

Now divide every side of that triangle by the current.

Suppose the current is two amperes. Sixty volts divided by two amperes is thirty ohms: the resistance. Eighty volts divided by two amperes is forty ohms: the reactance of the coil. And the long side, a hundred volts divided by two amperes, is fifty ohms.

That fifty ohms is the total opposition of the circuit to alternating current. It is not resistance, and it is not reactance. It is the two combined, at right angles. It has its own name: impedance. Its symbol is the letter Z.

The word was coined in eighteen eighty-six by Oliver Heaviside, the self-taught English engineer who gave us much of the language of circuits.

Impedance is the square root of the resistance squared plus the reactance squared. And with it, Ohm's law works again for alternating current: voltage equals current times impedance.

The triangle tells us one more thing. The angle at its corner is the phase angle between the supply voltage and the current. Here it is about fifty-three degrees. The current is not in step, as in a pure resistor, and not a full quarter cycle behind, as in a pure coil. It is somewhere in between, and the triangle says exactly where.

---

## 7. Add a capacitor

**On screen:** A capacitor is added to the series circuit. On the diagram, the coil's voltage arrow points up, and the capacitor's points straight down. The two are laid tip to tail: one runs up, the other comes part of the way back. What is left is the net reactance. Figures: resistance 40 ohms, coil 40 ohms, capacitor 10 ohms; net reactance 30; impedance 50. Then the capacitor's arrow is stretched until it cancels the coil's completely, and the long side of the triangle collapses onto the resistance.

Now add a capacitor to the same circuit.

Its voltage arrow points a quarter turn behind the current: straight down. The coil's points straight up. They are in exactly opposite directions. So instead of adding, they subtract.

Take a circuit with a resistance of forty ohms, a coil with a reactance of forty ohms, and a capacitor with a reactance of ten ohms. The coil's forty, less the capacitor's ten, leaves a net reactance of thirty ohms. And forty and thirty, at right angles, make an impedance of fifty.

Notice something odd. Adding a component has made the reactance smaller. A coil and a capacitor in series work against each other. At every instant, when the coil is taking energy in, the capacitor is giving it out.

And what if the two reactances were exactly equal? Then they would cancel completely. The triangle would collapse flat. The impedance would be the resistance alone, and the current would be as large as it could possibly be. That is resonance, and it is the subject of the next video.

---

## 8. A real coil

**On screen:** An electromagnet: a large coil on an iron core, with a nameplate. Its figures: resistance 12 ohms, inductance 51 millihenries. On 230 volts at 50 hertz: reactance 16 ohms, impedance 20 ohms, current 11.5 amperes. The triangle: 12, 16, 20. Then the same coil on 230 volts of direct current: reactance zero, current 19 amperes, and the winding glowing dull red. Then a transformer, connected by mistake to a direct supply, smoking.

Let us use all this on something real.

No real coil is a pure inductance. It is wound from wire, and wire has resistance. So every real coil is a resistance and an inductance in series, exactly the circuit we have been drawing.

Take an electromagnet. Its winding has a resistance of twelve ohms, and an inductance of fifty-one thousandths of a henry. Connect it to the mains: two hundred and thirty volts, at fifty hertz.

First the reactance. Two pi, times fifty, times the inductance, comes to sixteen ohms.

Then the impedance. Twelve squared is a hundred and forty-four. Sixteen squared is two hundred and fifty-six. Together, four hundred. The square root is twenty ohms.

So the current is two hundred and thirty volts divided by twenty ohms: eleven and a half amperes. And it lags the voltage by fifty-three degrees.

Now connect the same coil to two hundred and thirty volts of direct current. The reactance vanishes. Only the twelve ohms of resistance is left, and the current rises to nineteen amperes. Every bit of it makes heat.

This is why a transformer or a motor built for alternating current must never be connected to a direct supply of the same voltage. On alternating current, reactance does most of the work of holding the current back. Take the alternation away, and only the thin resistance of the wire stands in the way.

---

## 9. Recap

**On screen:** The timeline, complete. The turning arrow and its wave. The frozen diagram. The three components as pairs of arrows. The triangle of sixty, eighty and one hundred. The impedance triangle. End card: Like · Share · Subscribe, with the channel handle @electricalmcqs.

So let's put it together.

A sine wave is the height of a turning arrow. The arrow's length is the size of the wave, and its angle is the timing.

In one circuit, all the arrows turn together. So we freeze them, and draw a phasor diagram.

A resistor's voltage arrow lies along the current. A coil's is a quarter turn ahead. A capacitor's is a quarter turn behind.

Voltages that are out of step are added as arrows, tip to tail, not as plain numbers.

And the total opposition is the impedance: resistance and reactance combined at right angles. Voltage equals current times impedance.

We saw that a coil and a capacitor pull in opposite directions. Next time, we set them exactly against each other, and find out what happens when they cancel. It is how a radio picks one station out of thousands. Next time: resonance.

If this helped you see it, and not just calculate it, please like, share, and subscribe to this channel.
