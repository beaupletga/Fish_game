## Visualisation_project (Master 2 MPRI - Computer Graphics and Visualization)

The project is in 2 parts.

### Hierarchical Segmentation

This first part is about applying hierarchical segmentation to Micro CT Scan in order to extract each fish from a Scan containing several fishes. All of this is done for the ScanAllFish project (https://osf.io/ecmz4/wiki/Fishes/).

The algorithm implemented is from the paper http://www.harishd.com/home/assets/papers/topoangler.pdf

I first stack several fishes manually on top of the other and downsample each of them for computational reasons.

![Superposition of the fish](/Presentation2/Images/fish_superposition.png)

Then I compute the join tree and remove branches from the join tree until n branches are left (where n is a number of features selected by the user). I didn't colored each different part differently because the separation between the parts is quite obvious.<br/>
Separation in 35 parts: <br/>
![Separation in 35 parts](/Presentation2/Images/35_fishes_separation.png)
<br/>
Separation in 3 parts:<br/>
![Separation in 3 parts](/Presentation2/Images/3_fishes_separation.png)
<br/>
Separation in 2 parts:<br/>
![Separation in 2 parts](/Presentation2/Images/2_fishes_separation.png)


Once the segmentation is done, I upsample each segmented fish and save the minimum bounding box for each fish.

Then I compute the marching cube algorithm to get the mesh of the fish. 

![Mesh of the fish](/Presentation2/Images/cura_fish.png)

Then I export the Mesh into a .obj file in order to use it in later.

### Animation

The goal of this part is to animate the fish previously extracted. This is done using the library Three.js.

I first import the .obj file created in the previous part.

Then I need to make it move the fin (nageoire). In order to do that I use to keyframe for the fin : one where the fin is at the extreme left position and another one where the fin is at the extreme right position. All the intermediate position are computed using linear interpolation.

![Keyframe 1 : extreme left position](/Presentation2/Images/left_fin.png)
![Keyframe 2 : extreme right position](/Presentation2/Images/right_fin.png)

Thus, we know how to make the fish move (translation and rotation) and we know how to make the fish move his fin. Our animation should look like something realistic !

The last part is to make an animated scene. Two choices are possible : a random swim of the fish (quite lame), or make a game with it (like the snake game for instance).
I choose the last solution and made something similar to the snake game. Then I added some texture to the floor and the background.

![Alt Text](/Presentation2/Images/fish_game.gif)

## How to play the game

Run the following python command (you need it to load file using javascript): python -m SimpleHTTPServer<br/>
Then run into your browser the file "page.html" which is into the Fish_game folder.


